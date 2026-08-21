package com.vilp.auth.dto;

import com.vilp.user.entity.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Firebase Login Request DTO
 * Carries verified credentials from Firebase Auth (Google Sign-In / Email)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FirebaseLoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    private String email;

    private String displayName;
    private String uid;
    private String idToken;
    private UserRole role; // Optional, defaults to STUDENT for new registrations
}
