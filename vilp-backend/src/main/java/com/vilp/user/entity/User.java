package com.vilp.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * User entity — maps to the `users` table.
 * Supports both email/password and Google OAuth authentication.
 * Source: TRD §12.1, Blueprint §33
 *
 * Security rules (TRD §10, §11):
 * - Passwords stored as Argon2id/BCrypt hash ONLY
 * - JWT claims contain userId + role only (no PII)
 * - google_subject used for OAuth mapping
 */
@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    /**
     * Hashed password (Argon2id or BCrypt).
     * NULL for Google-only accounts.
     * NEVER store plaintext. (TRD §11)
     */
    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    /**
     * Google OAuth subject ID.
     * NULL for email/password-only accounts.
     * Unique — prevents Google identity reuse across accounts.
     */
    @Column(name = "google_subject", unique = true, length = 255)
    private String googleSubject;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    /**
     * Account status.
     * ACTIVE | SUSPENDED | DELETED
     */
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private String status = "ACTIVE";

    @Column(name = "email_verified", nullable = false)
    @Builder.Default
    private Boolean emailVerified = true;

    @Column(name = "verification_token", length = 255)
    private String verificationToken;

    @Column(name = "verification_token_expiry")
    private OffsetDateTime verificationTokenExpiry;

    @Column(name = "reset_token", length = 255)
    private String resetToken;

    @Column(name = "reset_token_expiry")
    private OffsetDateTime resetTokenExpiry;

    /**
     * Failed login attempt counter for rate limiting.
     * Reset to 0 on successful login. (TRD §11)
     */
    @Column(name = "failed_login_attempts", nullable = false)
    @Builder.Default
    private Integer failedLoginAttempts = 0;

    /**
     * Account locked until this time after too many failed attempts.
     * NULL means not locked.
     */
    @Column(name = "locked_until")
    private OffsetDateTime lockedUntil;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    // ─── Convenience methods ───────────────────────────────────────────────

    public boolean isActive() {
        return "ACTIVE".equals(this.status);
    }

    public boolean isLocked() {
        return lockedUntil != null && lockedUntil.isAfter(OffsetDateTime.now());
    }

    public UserRole getRoleName() {
        return role != null ? role.getName() : null;
    }
}
