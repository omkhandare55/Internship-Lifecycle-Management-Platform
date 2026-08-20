package com.vilp.company.entity;

import com.vilp.user.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Company entity — maps to the `companies` table.
 * Source: TRD §12.4
 *
 * Verification state machine:
 * PENDING → UNDER_REVIEW → VERIFIED | REJECTED | SUSPENDED
 */
@Entity
@Table(name = "companies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "website", length = 500)
    private String website;

    @Column(name = "industry", length = 100)
    private String industry;

    @Column(name = "size", length = 50)
    private String size;  // STARTUP | SMALL | MEDIUM | LARGE | ENTERPRISE

    @Column(name = "headquarters", length = 255)
    private String headquarters;

    @Column(name = "contact_email", length = 255)
    private String contactEmail;

    @Column(name = "contact_phone", length = 20)
    private String contactPhone;

    @Column(name = "contact_person_name", length = 255)
    private String contactPersonName;

    @Column(name = "verification_status", nullable = false, length = 50)
    @Builder.Default
    private String verificationStatus = "PENDING";

    @Column(name = "verification_date")
    private OffsetDateTime verificationDate;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
