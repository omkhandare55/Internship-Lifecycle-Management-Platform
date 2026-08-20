package com.vilp.evaluation.entity;

import com.vilp.internship.entity.Internship;
import com.vilp.student.entity.Student;
import com.vilp.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Midterm & Final Evaluation entity
 * Source: PRD §15, TRD §17, §26
 */
@Entity
@Table(name = "evaluations",
       uniqueConstraints = @UniqueConstraint(columnNames = {"internship_id", "student_id", "evaluator_type", "evaluation_type"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id", nullable = false)
    private User evaluator;

    @Column(name = "evaluator_type", nullable = false, length = 50)
    private String evaluatorType; // MENTOR | COMPANY

    @Column(name = "evaluation_type", nullable = false, length = 50)
    private String evaluationType; // MIDTERM | FINAL

    @Column(name = "technical_skills_rating", nullable = false)
    private Integer technicalSkillsRating; // 1 - 5

    @Column(name = "communication_rating", nullable = false)
    private Integer communicationRating; // 1 - 5

    @Column(name = "punctuality_rating", nullable = false)
    private Integer punctualityRating; // 1 - 5

    @Column(name = "initiative_rating", nullable = false)
    private Integer initiativeRating; // 1 - 5

    @Column(name = "overall_performance_rating", nullable = false)
    private Integer overallPerformanceRating; // 1 - 5

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "ppo_recommended")
    @Builder.Default
    private Boolean ppoRecommended = false;

    @Column(name = "ppo_terms", columnDefinition = "TEXT")
    private String ppoTerms;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "SUBMITTED";

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
