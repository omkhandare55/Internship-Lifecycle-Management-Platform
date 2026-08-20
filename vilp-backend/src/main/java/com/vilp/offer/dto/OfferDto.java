package com.vilp.offer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public class OfferDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OfferResponse {
        private UUID id;
        private UUID applicationId;
        private UUID internshipId;
        private String internshipTitle;
        private UUID companyId;
        private String companyName;
        private UUID studentId;
        private String studentName;
        private BigDecimal stipend;
        private LocalDate startDate;
        private LocalDate endDate;
        private String status;
        private String termsAndConditions;
        private OffsetDateTime expiryDate;
        private OffsetDateTime responseDate;
        private String responseNotes;
        private UUID offerLetterDocId;
        private OffsetDateTime createdAt;
    }

    @Data
    public static class CreateOfferRequest {
        private UUID applicationId;
        private BigDecimal stipend;
        private LocalDate startDate;
        private LocalDate endDate;
        private String termsAndConditions;
        private OffsetDateTime expiryDate;
    }

    @Data
    public static class RespondOfferRequest {
        private String action; // ACCEPT | REJECT
        private String notes;
    }

    public static OfferResponse toResponse(com.vilp.offer.entity.Offer o) {
        return OfferResponse.builder()
                .id(o.getId())
                .applicationId(o.getApplication() != null ? o.getApplication().getId() : null)
                .internshipId(o.getInternship() != null ? o.getInternship().getId() : null)
                .internshipTitle(o.getInternship() != null ? o.getInternship().getTitle() : null)
                .companyId(o.getCompany() != null ? o.getCompany().getId() : null)
                .companyName(o.getCompany() != null ? o.getCompany().getName() : null)
                .studentId(o.getStudent() != null ? o.getStudent().getId() : null)
                .studentName(o.getStudent() != null ? o.getStudent().getFullName() : null)
                .stipend(o.getStipend())
                .startDate(o.getStartDate())
                .endDate(o.getEndDate())
                .status(o.getStatus())
                .termsAndConditions(o.getTermsAndConditions())
                .expiryDate(o.getExpiryDate())
                .responseDate(o.getResponseDate())
                .responseNotes(o.getResponseNotes())
                .offerLetterDocId(o.getOfferLetterDocument() != null ? o.getOfferLetterDocument().getId() : null)
                .createdAt(o.getCreatedAt())
                .build();
    }
}
