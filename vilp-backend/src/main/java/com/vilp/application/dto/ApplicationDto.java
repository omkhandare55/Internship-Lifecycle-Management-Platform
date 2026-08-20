package com.vilp.application.dto;

import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

public class ApplicationDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class ApplicationResponse {
        private UUID id;
        private UUID internshipId;
        private String internshipTitle;
        private String companyName;
        private UUID studentId;
        private String studentName;
        private String status;
        private String coverLetter;
        private OffsetDateTime appliedAt;
        private OffsetDateTime updatedAt;
        private String rejectionReason;
    }

    @Data
    public static class ApplyRequest {
        private UUID internshipId;
        private String coverLetter;
    }

    @Data
    public static class StatusUpdateRequest {
        private String status;           // SHORTLISTED | INTERVIEW | SELECTED | REJECTED
        private String rejectionReason;  // required when status=REJECTED
    }

    public static ApplicationResponse toResponse(com.vilp.application.entity.Application a) {
        var i = a.getInternship();
        var s = a.getStudent();
        return ApplicationResponse.builder()
                .id(a.getId())
                .internshipId(i != null ? i.getId() : null)
                .internshipTitle(i != null ? i.getTitle() : null)
                .companyName(i != null && i.getCompany() != null ? i.getCompany().getName() : null)
                .studentId(s != null ? s.getId() : null)
                .studentName(s != null ? s.getFullName() : null)
                .status(a.getStatus())
                .coverLetter(a.getCoverLetter())
                .appliedAt(a.getAppliedAt())
                .updatedAt(a.getUpdatedAt())
                .rejectionReason(a.getRejectionReason())
                .build();
    }
}
