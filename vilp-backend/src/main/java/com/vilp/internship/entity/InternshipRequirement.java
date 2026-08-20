package com.vilp.internship.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Internship eligibility requirement — maps to `internship_requirements`.
 * One-to-one with Internship. Used by EligibilityEngine (Phase 3).
 * Source: TRD §13
 */
@Entity
@Table(name = "internship_requirements")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InternshipRequirement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false, unique = true)
    private Internship internship;

    @Column(name = "minimum_cgpa", precision = 4, scale = 2)
    @Builder.Default
    private BigDecimal minimumCgpa = BigDecimal.ZERO;

    @Column(name = "maximum_backlogs")
    @Builder.Default
    private Integer maximumBacklogs = 999;

    @Column(name = "department", length = 100)
    private String department;  // null = all departments

    @Column(name = "branch", length = 100)
    private String branch;       // null = all branches

    @Column(name = "passing_year")
    private Integer passingYear;

    @Column(name = "required_experience")
    @Builder.Default
    private Integer requiredExperience = 0;   // months

    @Column(name = "required_certifications", columnDefinition = "TEXT")
    private String requiredCertifications;    // JSON array stored as text
}
