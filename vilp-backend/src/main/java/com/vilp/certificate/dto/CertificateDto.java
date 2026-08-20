package com.vilp.certificate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public class CertificateDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CertificateResponse {
        private UUID id;
        private UUID studentId;
        private String studentName;
        private String studentNumber;
        private String departmentName;
        private UUID internshipId;
        private String internshipTitle;
        private UUID companyId;
        private String companyName;
        private String certificateNumber;
        private LocalDate issueDate;
        private String grade;
        private Integer totalHoursCompleted;
        private String status;
        private String verificationHash;
        private UUID documentId;
        private OffsetDateTime createdAt;
    }

    @Data
    public static class IssueCertificateRequest {
        private UUID studentId;
        private UUID internshipId;
        private String grade; // A+ | A | B+ | B
        private Integer totalHoursCompleted;
    }

    public static CertificateResponse toResponse(com.vilp.certificate.entity.Certificate c) {
        var s = c.getStudent();
        var i = c.getInternship();
        var comp = c.getCompany();
        return CertificateResponse.builder()
                .id(c.getId())
                .studentId(s != null ? s.getId() : null)
                .studentName(s != null ? s.getFullName() : null)
                .studentNumber(s != null ? s.getStudentNumber() : null)
                .departmentName(s != null && s.getDepartment() != null ? s.getDepartment().getName() : null)
                .internshipId(i != null ? i.getId() : null)
                .internshipTitle(i != null ? i.getTitle() : null)
                .companyId(comp != null ? comp.getId() : null)
                .companyName(comp != null ? comp.getName() : null)
                .certificateNumber(c.getCertificateNumber())
                .issueDate(c.getIssueDate())
                .grade(c.getGrade())
                .totalHoursCompleted(c.getTotalHoursCompleted())
                .status(c.getStatus())
                .verificationHash(c.getVerificationHash())
                .documentId(c.getDocument() != null ? c.getDocument().getId() : null)
                .createdAt(c.getCreatedAt())
                .build();
    }
}
