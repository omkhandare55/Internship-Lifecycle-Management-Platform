package com.vilp.verification.service;

import com.vilp.company.repository.CompanyRepository;
import com.vilp.documents.repository.DocumentRepository;
import com.vilp.exception.ResourceNotFoundException;
import com.vilp.internship.repository.InternshipRepository;
import com.vilp.student.repository.StudentRepository;
import com.vilp.user.entity.User;
import com.vilp.user.repository.UserRepository;
import com.vilp.verification.dto.VerificationDto;
import com.vilp.verification.entity.Verification;
import com.vilp.verification.repository.VerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final InternshipRepository internshipRepository;
    private final DocumentRepository documentRepository;

    public VerificationDto.VerificationResponse submit(UUID submitterId, VerificationDto.SubmitVerificationRequest req) {
        User submitter = userRepository.findById(submitterId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Verification verification = Verification.builder()
                .entityType(req.getEntityType().toUpperCase())
                .entityId(req.getEntityId())
                .verificationType(req.getVerificationType())
                .status("PENDING")
                .submittedBy(submitter)
                .verificationNotes(req.getNotes())
                .build();

        verificationRepository.save(verification);
        log.info("Verification request submitted for entityType={} entityId={}", req.getEntityType(), req.getEntityId());
        return VerificationDto.toResponse(verification);
    }

    public VerificationDto.VerificationResponse process(
            UUID reviewerId,
            UUID verificationId,
            VerificationDto.ProcessVerificationRequest req) {

        User reviewer = userRepository.findById(reviewerId)
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found"));

        Verification v = verificationRepository.findById(verificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Verification record not found"));

        String newStatus = req.getStatus().toUpperCase();
        v.setStatus(newStatus);
        v.setVerifiedBy(reviewer);
        v.setVerificationNotes(req.getNotes());
        v.setRejectionReason(req.getRejectionReason());
        v.setVerifiedAt(OffsetDateTime.now());

        // Synchronize corresponding entity status
        syncEntityState(v.getEntityType(), v.getEntityId(), newStatus, req.getRejectionReason());

        verificationRepository.save(v);
        log.info("Verification {} processed with status {} by reviewer {}", verificationId, newStatus, reviewerId);
        return VerificationDto.toResponse(v);
    }

    private void syncEntityState(String entityType, UUID entityId, String status, String reason) {
        switch (entityType) {
            case "STUDENT" -> studentRepository.findById(entityId).ifPresent(student -> {
                student.setVerificationStatus(status);
                studentRepository.save(student);
            });
            case "COMPANY" -> companyRepository.findById(entityId).ifPresent(company -> {
                company.setVerificationStatus(status);
                if ("VERIFIED".equals(status)) {
                    company.setVerificationDate(OffsetDateTime.now());
                }
                companyRepository.save(company);
            });
            case "INTERNSHIP" -> internshipRepository.findById(entityId).ifPresent(internship -> {
                internship.setVerificationStatus(status);
                if ("VERIFIED".equals(status)) {
                    internship.setStatus("APPLICATION_OPEN");
                } else if ("REJECTED".equals(status)) {
                    internship.setStatus("REJECTED");
                }
                internshipRepository.save(internship);
            });
            case "DOCUMENT" -> documentRepository.findById(entityId).ifPresent(doc -> {
                doc.setStatus(status);
                doc.setVerificationReason(reason);
                documentRepository.save(doc);
            });
            default -> log.info("No specific entity sync needed for entityType: {}", entityType);
        }
    }

    @Transactional(readOnly = true)
    public Page<VerificationDto.VerificationResponse> getQueue(String entityType, String status, Pageable pageable) {
        if (entityType != null && status != null) {
            return verificationRepository.findByEntityTypeAndStatus(entityType.toUpperCase(), status.toUpperCase(), pageable)
                    .map(VerificationDto::toResponse);
        } else if (status != null) {
            return verificationRepository.findByStatus(status.toUpperCase(), pageable)
                    .map(VerificationDto::toResponse);
        }
        return verificationRepository.findAll(pageable).map(VerificationDto::toResponse);
    }

    @Transactional(readOnly = true)
    public VerificationDto.VerificationResponse getById(UUID id) {
        return VerificationDto.toResponse(verificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Verification not found")));
    }
}
