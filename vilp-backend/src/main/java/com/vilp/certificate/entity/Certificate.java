package com.vilp.certificate.entity;

import com.vilp.company.entity.Company;
import com.vilp.documents.entity.Document;
import com.vilp.internship.entity.Internship;
import com.vilp.student.entity.Student;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Cryptographically Verifiable Completion Certificate entity
 * Source: TRD §25, Blueprint §33
 */
@Entity
@Table(name = "certificates",
       uniqueConstraints = @UniqueConstraint(columnNames = {"student_id", "internship_id"}))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Certificate {

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(name = "certificate_number", nullable = false, length = 50, unique = true)
    private String certificateNumber; // CERT-2026-XXXXX

    @Column(name = "issue_date", nullable = false)
    @Builder.Default
    private LocalDate issueDate = LocalDate.now();

    @Column(name = "grade", nullable = false, length = 10)
    @Builder.Default
    private String grade = "A";

    @Column(name = "total_hours_completed", nullable = false)
    @Builder.Default
    private Integer totalHoursCompleted = 240;

    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "ISSUED"; // ISSUED | REVOKED

    @Column(name = "verification_hash", nullable = false, length = 255)
    private String verificationHash;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id")
    private Document document;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
