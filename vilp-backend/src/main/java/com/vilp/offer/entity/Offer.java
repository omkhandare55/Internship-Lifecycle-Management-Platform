package com.vilp.offer.entity;

import com.vilp.application.entity.Application;
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
 * Offer entity — maps to `offers` table.
 * Source: PRD §12, TRD §26
 *
 * State machine:
 * OFFERED -> ACCEPTED | REJECTED | EXPIRED | REVOKED
 */
@Entity
@Table(name = "offers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "stipend", precision = 10, scale = 2)
    private BigDecimal stipend;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "OFFERED"; // OFFERED | ACCEPTED | REJECTED | EXPIRED | REVOKED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_letter_doc_id")
    private Document offerLetterDocument;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acceptance_letter_doc_id")
    private Document acceptanceLetterDocument;

    @Column(name = "terms_and_conditions", columnDefinition = "TEXT")
    private String termsAndConditions;

    @Column(name = "expiry_date")
    private OffsetDateTime expiryDate;

    @Column(name = "response_date")
    private OffsetDateTime responseDate;

    @Column(name = "response_notes", columnDefinition = "TEXT")
    private String responseNotes;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
