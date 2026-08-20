package com.vilp.ppo.entity;

import com.vilp.company.entity.Company;
import com.vilp.documents.entity.Document;
import com.vilp.internship.entity.Internship;
import com.vilp.student.entity.Student;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Pre-Placement Offer (PPO) entity — maps to `ppo_records` table.
 * Source: PRD §16, Blueprint §33
 */
@Entity
@Table(name = "ppo_records",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "company_id", "internship_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class PpoRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @Column(name = "designation", nullable = false, length = 100)
    private String designation;

    @Column(name = "ctc_annual", nullable = false, precision = 12, scale = 2)
    private BigDecimal ctcAnnual;

    @Column(name = "joining_date")
    private LocalDate joiningDate;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "OFFERED"; // OFFERED | ACCEPTED | DECLINED | JOINED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_letter_doc_id")
    private Document offerLetterDocument;

    @Column(name = "terms", columnDefinition = "TEXT")
    private String terms;

    @Column(name = "accepted_at")
    private OffsetDateTime acceptedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
