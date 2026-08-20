package com.vilp.verification.entity;

import com.vilp.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Universal Verification entity — maps to `verifications` table.
 * Source: TRD §15
 *
 * Status lifecycle:
 * PENDING → UNDER_REVIEW → VERIFIED | REJECTED | SUSPENDED
 */
@Entity
@Table(name = "verifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Verification {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType; // STUDENT | COMPANY | INTERNSHIP | DOCUMENT | OFFER | CERTIFICATE

    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    @Column(name = "verification_type", nullable = false, length = 100)
    private String verificationType;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "PENDING"; // PENDING | UNDER_REVIEW | VERIFIED | REJECTED | SUSPENDED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by", nullable = false)
    private User submittedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    @Column(name = "verification_notes", columnDefinition = "TEXT")
    private String verificationNotes;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime submittedAt = OffsetDateTime.now();

    @Column(name = "verified_at")
    private OffsetDateTime verifiedAt;
}
