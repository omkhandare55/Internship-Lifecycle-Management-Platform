package com.vilp.ppo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public class PpoDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PpoResponse {
        private UUID id;
        private UUID studentId;
        private String studentName;
        private String studentNumber;
        private String departmentName;
        private UUID companyId;
        private String companyName;
        private UUID internshipId;
        private String internshipTitle;
        private String designation;
        private BigDecimal ctcAnnual;
        private LocalDate joiningDate;
        private String location;
        private String status;
        private String terms;
        private OffsetDateTime acceptedAt;
        private OffsetDateTime createdAt;
    }

    @Data
    public static class CreatePpoRequest {
        private UUID studentId;
        private UUID internshipId;
        private String designation;
        private BigDecimal ctcAnnual;
        private LocalDate joiningDate;
        private String location;
        private String terms;
    }

    @Data
    public static class RespondPpoRequest {
        private String action; // ACCEPT | DECLINE
    }

    public static PpoResponse toResponse(com.vilp.ppo.entity.PpoRecord p) {
        var s = p.getStudent();
        var c = p.getCompany();
        var i = p.getInternship();
        return PpoResponse.builder()
                .id(p.getId())
                .studentId(s != null ? s.getId() : null)
                .studentName(s != null ? s.getFullName() : null)
                .studentNumber(s != null ? s.getStudentNumber() : null)
                .departmentName(s != null && s.getDepartment() != null ? s.getDepartment().getName() : null)
                .companyId(c != null ? c.getId() : null)
                .companyName(c != null ? c.getName() : null)
                .internshipId(i != null ? i.getId() : null)
                .internshipTitle(i != null ? i.getTitle() : null)
                .designation(p.getDesignation())
                .ctcAnnual(p.getCtcAnnual())
                .joiningDate(p.getJoiningDate())
                .location(p.getLocation())
                .status(p.getStatus())
                .terms(p.getTerms())
                .acceptedAt(p.getAcceptedAt())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
