package com.vilp.offer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

public class NocDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NocResponse {
        private UUID id;
        private UUID offerId;
        private UUID studentId;
        private String studentName;
        private String studentNumber;
        private String departmentName;
        private UUID internshipId;
        private String internshipTitle;
        private String companyName;
        private String status;
        private OffsetDateTime requestedAt;
        private UUID approvedBy;
        private OffsetDateTime approvedAt;
        private String rejectionReason;
        private String verificationCode;
        private UUID nocDocumentId;
    }

    @Data
    public static class ProcessNocRequest {
        private String decision; // APPROVED | REJECTED
        private String rejectionReason;
    }

    public static NocResponse toResponse(com.vilp.offer.entity.NocRequest n) {
        var s = n.getStudent();
        var i = n.getInternship();
        var o = n.getOffer();
        return NocResponse.builder()
                .id(n.getId())
                .offerId(o != null ? o.getId() : null)
                .studentId(s != null ? s.getId() : null)
                .studentName(s != null ? s.getFullName() : null)
                .studentNumber(s != null ? s.getStudentNumber() : null)
                .departmentName(n.getDepartment() != null ? n.getDepartment().getName() : (s != null && s.getDepartment() != null ? s.getDepartment().getName() : null))
                .internshipId(i != null ? i.getId() : null)
                .internshipTitle(i != null ? i.getTitle() : null)
                .companyName(o != null && o.getCompany() != null ? o.getCompany().getName() : null)
                .status(n.getStatus())
                .requestedAt(n.getRequestedAt())
                .approvedBy(n.getApprovedBy() != null ? n.getApprovedBy().getId() : null)
                .approvedAt(n.getApprovedAt())
                .rejectionReason(n.getRejectionReason())
                .verificationCode(n.getVerificationCode())
                .nocDocumentId(n.getNocDocument() != null ? n.getNocDocument().getId() : null)
                .build();
    }
}
