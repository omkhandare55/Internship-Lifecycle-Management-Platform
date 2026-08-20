package com.vilp.offer.entity;

import com.vilp.documents.entity.Document;
import com.vilp.internship.entity.Internship;
import com.vilp.student.entity.Department;
import com.vilp.student.entity.Student;
import com.vilp.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Institutional NOC (No Objection Certificate) Request entity
 * Source: PRD §13, Blueprint §31
 *
 * State machine:
 * PENDING_REVIEW -> APPROVED | REJECTED
 */
@Entity
@Table(name = "noc_requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class NocRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offer_id", nullable = false, unique = true)
    private Offer offer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "PENDING_REVIEW"; // PENDING_REVIEW | APPROVED | REJECTED

    @Column(name = "requested_at", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime requestedAt = OffsetDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_at")
    private OffsetDateTime approvedAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "noc_document_id")
    private Document nocDocument;

    @Column(name = "verification_code", length = 50, unique = true)
    private String verificationCode; // NOC-2026-XXXXX

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
