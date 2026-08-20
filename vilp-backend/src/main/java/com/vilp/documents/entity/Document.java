package com.vilp.documents.entity;

import com.vilp.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Document metadata entity — maps to `documents` table.
 * Physical files stored in object storage / local storage.
 * Source: TRD §16, §17
 */
@Entity
@Table(name = "documents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @Column(name = "entity_type", nullable = false, length = 50)
    private String entityType; // STUDENT | COMPANY | INTERNSHIP | APPLICATION | OFFER

    @Column(name = "entity_id", nullable = false)
    private UUID entityId;

    @Column(name = "document_type", nullable = false, length = 100)
    private String documentType; // RESUME | OFFER_LETTER | ACADEMIC_PROOF | etc.

    @Column(name = "storage_key", nullable = false, length = 500)
    private String storageKey;

    @Column(name = "original_filename", nullable = false, length = 255)
    private String originalFilename;

    @Column(name = "mime_type", nullable = false, length = 100)
    private String mimeType;

    @Column(name = "size", nullable = false)
    private Long size;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "UPLOADED"; // UPLOADED | UNDER_REVIEW | VERIFIED | REJECTED | EXPIRED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by")
    private User verifiedBy;

    @Column(name = "verification_reason", columnDefinition = "TEXT")
    private String verificationReason;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
