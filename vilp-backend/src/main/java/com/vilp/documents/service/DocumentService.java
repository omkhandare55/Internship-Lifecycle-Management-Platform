package com.vilp.documents.service;

import com.vilp.documents.dto.DocumentDto;
import com.vilp.documents.entity.Document;
import com.vilp.documents.repository.DocumentRepository;
import com.vilp.exception.AuthException;
import com.vilp.exception.ResourceNotFoundException;
import com.vilp.user.entity.User;
import com.vilp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    private SupabaseStorageService supabaseStorageService;

    private String buildDownloadUrl(Document doc) {
        if (supabaseStorageService != null) {
            // 1-hour signed URL
            return supabaseStorageService.getSignedUrl(doc.getStorageKey(), 3600);
        }
        return "/api/documents/" + doc.getId() + "/download";
    }

    public DocumentDto.DocumentResponse upload(
            UUID userId,
            String entityType,
            UUID entityId,
            String documentType,
            MultipartFile file) throws IOException {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String subDirectory = entityType.toLowerCase() + "/" + entityId.toString();
        String storageKey = storageService.store(file, subDirectory);

        Document doc = Document.builder()
                .entityType(entityType.toUpperCase())
                .entityId(entityId)
                .documentType(documentType.toUpperCase())
                .storageKey(storageKey)
                .originalFilename(file.getOriginalFilename())
                .mimeType(file.getContentType())
                .size(file.getSize())
                .uploadedBy(user)
                .status("UPLOADED")
                .build();

        documentRepository.save(doc);
        log.info("Document uploaded: {} by user {}", doc.getId(), userId);

        return DocumentDto.toResponse(doc, buildDownloadUrl(doc));
    }

    @Transactional(readOnly = true)
    public List<DocumentDto.DocumentResponse> getByEntity(String entityType, UUID entityId) {
        return documentRepository.findByEntityTypeAndEntityId(entityType.toUpperCase(), entityId)
                .stream()
                .map(d -> DocumentDto.toResponse(d, buildDownloadUrl(d)))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Document getEntityById(UUID documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));
    }

    @Transactional(readOnly = true)
    public Resource loadFileAsResource(UUID userId, boolean isPrivileged, UUID documentId) {
        Document doc = getEntityById(documentId);
        if (!isPrivileged && (doc.getUploadedBy() == null || !doc.getUploadedBy().getId().equals(userId))) {
            throw new AuthException("FORBIDDEN", "Unauthorized to access this document");
        }
        return storageService.loadAsResource(doc.getStorageKey());
    }

    public DocumentDto.DocumentResponse updateStatus(
            UUID reviewerId,
            UUID documentId,
            DocumentDto.UpdateDocumentStatusRequest req) {

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer user not found"));

        Document doc = getEntityById(documentId);
        doc.setStatus(req.getStatus().toUpperCase());
        doc.setVerifiedBy(reviewer);
        doc.setVerificationReason(req.getReason());

        documentRepository.save(doc);
        log.info("Document {} status updated to {} by reviewer {}", documentId, req.getStatus(), reviewerId);

        return DocumentDto.toResponse(doc, buildDownloadUrl(doc));
    }

    @Transactional(readOnly = true)
    public Page<DocumentDto.DocumentResponse> listByStatus(String status, Pageable pageable) {
        return documentRepository.findByStatus(status.toUpperCase(), pageable)
                .map(d -> DocumentDto.toResponse(d, buildDownloadUrl(d)));
    }
}
