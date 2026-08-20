package com.vilp.auth.dto;

import com.vilp.user.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

/**
 * Token response returned on successful login or token refresh.
 * Source: TRD §10
 * Contains access token, refresh token, and minimal user info.
 * Does NOT contain PII beyond email (needed for UI display).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenResponse {

    private String accessToken;
    private String refreshToken;

    @Builder.Default
    private String tokenType = "Bearer";

    private long expiresIn; // access token expiry in seconds

    private AuthUserDto user;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthUserDto {
        private UUID id;
        private String email;
        private UserRole role;
        private boolean emailVerified;
    }
}
