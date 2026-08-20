package com.vilp.company.dto;

import lombok.*;
import java.time.OffsetDateTime;
import java.util.UUID;

public class CompanyDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CompanyResponse {
        private UUID id;
        private String name;
        private String description;
        private String website;
        private String industry;
        private String size;
        private String headquarters;
        private String contactEmail;
        private String contactPhone;
        private String contactPersonName;
        private String verificationStatus;
        private OffsetDateTime verificationDate;
        private OffsetDateTime createdAt;
    }

    @Data
    public static class CreateCompanyRequest {
        private String name;
        private String description;
        private String website;
        private String industry;
        private String size;
        private String headquarters;
        private String contactEmail;
        private String contactPhone;
        private String contactPersonName;
    }

    @Data
    public static class UpdateCompanyRequest {
        private String name;
        private String description;
        private String website;
        private String industry;
        private String size;
        private String headquarters;
        private String contactEmail;
        private String contactPhone;
        private String contactPersonName;
    }

    public static CompanyResponse toResponse(com.vilp.company.entity.Company c) {
        return CompanyResponse.builder()
                .id(c.getId()).name(c.getName()).description(c.getDescription())
                .website(c.getWebsite()).industry(c.getIndustry()).size(c.getSize())
                .headquarters(c.getHeadquarters()).contactEmail(c.getContactEmail())
                .contactPhone(c.getContactPhone()).contactPersonName(c.getContactPersonName())
                .verificationStatus(c.getVerificationStatus())
                .verificationDate(c.getVerificationDate()).createdAt(c.getCreatedAt())
                .build();
    }
}
