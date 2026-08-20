package com.vilp.student.dto;

import com.vilp.student.entity.Department;
import com.vilp.student.entity.Skill;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

/**
 * Student DTOs — request and response shapes.
 * Source: TRD §12.3, §34
 */
public class StudentDto {

    // ─── Response ─────────────────────────────────────────────────────────

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentResponse {
        private UUID id;
        private String studentNumber;
        private String fullName;
        private String email;
        private DepartmentSummary department;
        private String branch;
        private Integer semester;
        private BigDecimal cgpa;
        private Integer backlogs;
        private Integer passingYear;
        private String phone;
        private String linkedinUrl;
        private String portfolioUrl;
        private String about;
        private String verificationStatus;
        private Integer profileCompletion;
        private Set<SkillSummary> skills;
        private OffsetDateTime createdAt;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class DepartmentSummary {
        private Long id;
        private String name;
        private String code;
    }

    @Data @Builder @NoArgsConstructor @AllArgsConstructor
    public static class SkillSummary {
        private Long id;
        private String name;
        private String category;
    }

    // ─── Create / Update Request ───────────────────────────────────────────

    @Data
    public static class CreateProfileRequest {
        private String studentNumber;
        private String fullName;
        private Long departmentId;
        private String branch;
        private Integer semester;
        private BigDecimal cgpa;
        private Integer backlogs;
        private Integer passingYear;
        private String phone;
        private String linkedinUrl;
        private String portfolioUrl;
        private String about;
    }

    @Data
    public static class UpdateProfileRequest {
        private String fullName;
        private Long departmentId;
        private String branch;
        private Integer semester;
        private BigDecimal cgpa;
        private Integer backlogs;
        private Integer passingYear;
        private String phone;
        private String linkedinUrl;
        private String portfolioUrl;
        private String about;
    }

    // ─── Mapper helpers ────────────────────────────────────────────────────

    public static StudentResponse toResponse(com.vilp.student.entity.Student s) {
        return StudentResponse.builder()
                .id(s.getId())
                .studentNumber(s.getStudentNumber())
                .fullName(s.getFullName())
                .email(s.getUser() != null ? s.getUser().getEmail() : null)
                .department(s.getDepartment() != null ? DepartmentSummary.builder()
                        .id(s.getDepartment().getId())
                        .name(s.getDepartment().getName())
                        .code(s.getDepartment().getCode())
                        .build() : null)
                .branch(s.getBranch())
                .semester(s.getSemester())
                .cgpa(s.getCgpa())
                .backlogs(s.getBacklogs())
                .passingYear(s.getPassingYear())
                .phone(s.getPhone())
                .linkedinUrl(s.getLinkedinUrl())
                .portfolioUrl(s.getPortfolioUrl())
                .about(s.getAbout())
                .verificationStatus(s.getVerificationStatus())
                .profileCompletion(s.getProfileCompletion())
                .skills(s.getSkills() != null ? s.getSkills().stream()
                        .map(sk -> SkillSummary.builder()
                                .id(sk.getId()).name(sk.getName()).category(sk.getCategory()).build())
                        .collect(java.util.stream.Collectors.toSet()) : java.util.Collections.emptySet())
                .createdAt(s.getCreatedAt())
                .build();
    }
}
