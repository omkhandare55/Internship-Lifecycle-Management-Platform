package com.vilp.internship.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

public class InternshipDto {

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class InternshipResponse {
        private UUID id;
        private String uniqueId;
        private CompanySummary company;
        private String title;
        private String description;
        private String location;
        private String mode;
        private Integer duration;
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal stipend;
        private Integer vacancies;
        private OffsetDateTime applicationDeadline;
        private String status;
        private String verificationStatus;
        private Set<SkillSummary> requiredSkills;
        private RequirementSummary requirement;
        private OffsetDateTime createdAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class CompanySummary {
        private UUID id;
        private String name;
        private String industry;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SkillSummary {
        private Long id;
        private String name;
        private String category;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class RequirementSummary {
        private BigDecimal minimumCgpa;
        private Integer maximumBacklogs;
        private String department;
        private String branch;
        private Integer passingYear;
    }

    @Data
    public static class CreateInternshipRequest {
        private String title;
        private String description;
        private String location;
        private String mode;
        private Integer duration;
        private LocalDate startDate;
        private LocalDate endDate;
        private BigDecimal stipend;
        private Integer vacancies;
        private OffsetDateTime applicationDeadline;
        // Requirements
        private BigDecimal minimumCgpa;
        private Integer maximumBacklogs;
        private String department;
        private String branch;
        private Integer passingYear;
    }

    public static InternshipResponse toResponse(com.vilp.internship.entity.Internship i) {
        var co = i.getCompany();
        var req = i.getRequirement();
        return InternshipResponse.builder()
                .id(i.getId()).uniqueId(i.getUniqueId()).title(i.getTitle())
                .description(i.getDescription()).location(i.getLocation())
                .mode(i.getMode()).duration(i.getDuration())
                .startDate(i.getStartDate()).endDate(i.getEndDate())
                .stipend(i.getStipend()).vacancies(i.getVacancies())
                .applicationDeadline(i.getApplicationDeadline())
                .status(i.getStatus()).verificationStatus(i.getVerificationStatus())
                .company(co != null ? CompanySummary.builder()
                        .id(co.getId()).name(co.getName()).industry(co.getIndustry()).build() : null)
                .requiredSkills(i.getRequiredSkills() != null ? i.getRequiredSkills().stream()
                        .map(sk -> SkillSummary.builder().id(sk.getId()).name(sk.getName()).category(sk.getCategory()).build())
                        .collect(java.util.stream.Collectors.toSet()) : java.util.Collections.emptySet())
                .requirement(req != null ? RequirementSummary.builder()
                        .minimumCgpa(req.getMinimumCgpa()).maximumBacklogs(req.getMaximumBacklogs())
                        .department(req.getDepartment()).branch(req.getBranch())
                        .passingYear(req.getPassingYear()).build() : null)
                .createdAt(i.getCreatedAt())
                .build();
    }
}
