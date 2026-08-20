package com.vilp.verification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

public class VerificationDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerificationResponse {
        private UUID id;
        private String entityType;
        private UUID entityId;
        private String verificationType;
        private String status;
        private UUID submittedBy;
        private String submittedByEmail;
        private UUID verifiedBy;
        private String verificationNotes;
        private String rejectionReason;
        private OffsetDateTime submittedAt;
        private OffsetDateTime verifiedAt;
    }

    @Data
    public static class SubmitVerificationRequest {
        private String entityType;
        private UUID entityId;
        private String verificationType;
        private String notes;
    }

    @Data
    public static class ProcessVerificationRequest {
        private String status; // VERIFIED | REJECTED | UNDER_REVIEW | SUSPENDED
        private String notes;
        private String rejectionReason;
    }

    public static VerificationResponse toResponse(com.vilp.verification.entity.Verification v) {
        return VerificationResponse.builder()
                .id(v.getId())
                .entityType(v.getEntityType())
                .entityId(v.getEntityId())
                .verificationType(v.getVerificationType())
                .status(v.getStatus())
                .submittedBy(v.getSubmittedBy() != null ? v.getSubmittedBy().getId() : null)
                .submittedByEmail(v.getSubmittedBy() != null ? v.getSubmittedBy().getEmail() : null)
                .verifiedBy(v.getVerifiedBy() != null ? v.getVerifiedBy().getId() : null)
                .verificationNotes(v.getVerificationNotes())
                .rejectionReason(v.getRejectionReason())
                .submittedAt(v.getSubmittedAt())
                .verifiedAt(v.getVerifiedAt())
                .build();
    }
}
