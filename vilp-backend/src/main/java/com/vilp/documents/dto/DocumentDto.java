package com.vilp.documents.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

public class DocumentDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DocumentResponse {
        private UUID id;
        private String entityType;
        private UUID entityId;
        private String documentType;
        private String originalFilename;
        private String mimeType;
        private Long size;
        private String status;
        private String verificationReason;
        private UUID uploadedBy;
        private String downloadUrl;
        private OffsetDateTime createdAt;
        private OffsetDateTime updatedAt;
    }

    @Data
    public static class UpdateDocumentStatusRequest {
        private String status; // VERIFIED | REJECTED | UNDER_REVIEW
        private String reason;
    }

    public static DocumentResponse toResponse(com.vilp.documents.entity.Document d, String downloadUrl) {
        return DocumentResponse.builder()
                .id(d.getId())
                .entityType(d.getEntityType())
                .entityId(d.getEntityId())
                .documentType(d.getDocumentType())
                .originalFilename(d.getOriginalFilename())
                .mimeType(d.getMimeType())
                .size(d.getSize())
                .status(d.getStatus())
                .verificationReason(d.getVerificationReason())
                .uploadedBy(d.getUploadedBy() != null ? d.getUploadedBy().getId() : null)
                .downloadUrl(downloadUrl)
                .createdAt(d.getCreatedAt())
                .updatedAt(d.getUpdatedAt())
                .build();
    }
}
