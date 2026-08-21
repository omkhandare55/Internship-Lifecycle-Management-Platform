package com.vilp.documents.controller;

import com.vilp.common.dto.ApiResponse;
import com.vilp.documents.dto.DocumentDto;
import com.vilp.documents.entity.Document;
import com.vilp.documents.service.DocumentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Documents", description = "Document upload, retrieval and verification")
public class DocumentController {

    private final DocumentService documentService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload a document")
    public ResponseEntity<ApiResponse<DocumentDto.DocumentResponse>> upload(
            @RequestParam("entityType") String entityType,
            @RequestParam("entityId") UUID entityId,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails ud) throws IOException {

        UUID userId = UUID.fromString(ud.getUsername());
        DocumentDto.DocumentResponse response = documentService.upload(userId, entityType, entityId, documentType, file);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}/download")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Download a document")
    public ResponseEntity<Resource> download(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails ud) {
        UUID userId = UUID.fromString(ud.getUsername());
        boolean isPrivileged = ud.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TNP_OFFICER")
                            || a.getAuthority().equals("ROLE_TNP_HEAD")
                            || a.getAuthority().equals("ROLE_MENTOR")
                            || a.getAuthority().equals("ROLE_SUPER_ADMIN"));

        Document doc = documentService.getEntityById(id);
        Resource resource = documentService.loadFileAsResource(userId, isPrivileged, id);

        String contentType = doc.getMimeType() != null ? doc.getMimeType() : "application/octet-stream";

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getOriginalFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/entity/{entityType}/{entityId}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get documents for an entity")
    public ResponseEntity<ApiResponse<List<DocumentDto.DocumentResponse>>> getByEntity(
            @PathVariable String entityType,
            @PathVariable UUID entityId) {
        return ResponseEntity.ok(ApiResponse.success(documentService.getByEntity(entityType, entityId)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('TNP_OFFICER', 'TNP_HEAD', 'MENTOR', 'SUPER_ADMIN')")
    @Operation(summary = "Update document verification status")
    public ResponseEntity<ApiResponse<DocumentDto.DocumentResponse>> updateStatus(
            @PathVariable UUID id,
            @RequestBody DocumentDto.UpdateDocumentStatusRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        UUID reviewerId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(documentService.updateStatus(reviewerId, id, req)));
    }
}
