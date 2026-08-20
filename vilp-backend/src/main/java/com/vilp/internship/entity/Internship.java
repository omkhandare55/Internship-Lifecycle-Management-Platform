package com.vilp.internship.entity;

import com.vilp.company.entity.Company;
import com.vilp.student.entity.Skill;
import com.vilp.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * Internship entity — maps to the `internships` table.
 * Source: TRD §12.5
 *
 * Status state machine (TRD §26):
 * DRAFT → PUBLISHED → APPLICATION_OPEN → APPLICATION_CLOSED → SELECTION
 * → OFFER_PENDING → TNP_REVIEW → VERIFIED → ONGOING → COMPLETION_REVIEW
 * → COMPLETED → PPO_UPDATED
 */
@Entity
@Table(name = "internships")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Internship {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "location", length = 255)
    private String location;

    @Column(name = "mode", nullable = false, length = 50)
    private String mode;  // REMOTE | ONSITE | HYBRID

    @Column(name = "duration")
    private Integer duration;  // weeks

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "stipend", precision = 10, scale = 2)
    private BigDecimal stipend;

    @Column(name = "vacancies", nullable = false)
    @Builder.Default
    private Integer vacancies = 1;

    @Column(name = "application_deadline")
    private OffsetDateTime applicationDeadline;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "DRAFT";

    @Column(name = "verification_status", nullable = false, length = 50)
    @Builder.Default
    private String verificationStatus = "PENDING";

    @Column(name = "unique_id", length = 30, unique = true)
    private String uniqueId;  // INT-2026-00452

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @OneToOne(mappedBy = "internship", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private InternshipRequirement requirement;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "internship_skills",
        joinColumns = @JoinColumn(name = "internship_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> requiredSkills = new HashSet<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
