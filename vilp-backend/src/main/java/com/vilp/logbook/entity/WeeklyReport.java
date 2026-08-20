package com.vilp.logbook.entity;

import com.vilp.internship.entity.Internship;
import com.vilp.student.entity.Student;
import com.vilp.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Weekly Report / Periodic Logbook entity
 * Source: PRD §14, Blueprint §32
 *
 * State machine:
 * SUBMITTED -> APPROVED | REVISIONS_REQUESTED | REJECTED
 */
@Entity
@Table(name = "weekly_reports",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "internship_id", "week_number"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class WeeklyReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @Column(name = "week_number", nullable = false)
    private Integer weekNumber;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "hours_worked", nullable = false)
    @Builder.Default
    private Integer hoursWorked = 40;

    @Column(name = "tasks_summary", nullable = false, columnDefinition = "TEXT")
    private String tasksSummary;

    @Column(name = "skills_applied", columnDefinition = "TEXT")
    private String skillsApplied;

    @Column(name = "challenges_faced", columnDefinition = "TEXT")
    private String challengesFaced;

    @Column(name = "learnings", columnDefinition = "TEXT")
    private String learnings;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "SUBMITTED"; // SUBMITTED | APPROVED | REVISIONS_REQUESTED | REJECTED

    @Column(name = "mentor_feedback", columnDefinition = "TEXT")
    private String mentorFeedback;

    @Column(name = "rating")
    private Integer rating; // 1 - 5

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_id")
    private User reviewer;

    @Column(name = "reviewed_at")
    private OffsetDateTime reviewedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
