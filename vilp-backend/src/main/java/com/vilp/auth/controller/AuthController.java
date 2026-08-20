package com.vilp.auth.controller;

import com.vilp.auth.dto.*;
import com.vilp.auth.service.AuthService;
import com.vilp.common.dto.ApiResponse;
import com.vilp.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Authentication Controller
 * Source: TRD §34 (Auth endpoints)
 * All public endpoints are permitted via SecurityConfig.PUBLIC_PATHS
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register, login, token management and password reset")
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * POST /api/auth/register
     * Register a new user. Sends verification email.
     * Source: FR-AUTH-001, TRD §8
     */
    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful. Please check your email to verify your account."));
    }

    /**
     * POST /api/auth/login
     * Authenticate user, return JWT tokens.
     * Source: FR-AUTH-003, TRD §10
     */
    @PostMapping("/login")
    @Operation(summary = "Login with email and password")
    public ResponseEntity<ApiResponse<TokenResponse>> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse tokens = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(tokens));
    }

    /**
     * POST /api/auth/refresh
     * Refresh access token using a valid refresh token.
     */
    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token")
    public ResponseEntity<ApiResponse<TokenResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        TokenResponse tokens = authService.refresh(request);
        return ResponseEntity.ok(ApiResponse.success(tokens));
    }

    /**
     * POST /api/auth/logout
     * Client-side logout — instructs frontend to discard tokens.
     * (Stateless JWT: server-side revocation requires token blacklist — post-MVP feature)
     */
    @PostMapping("/logout")
    @Operation(summary = "Logout (discard tokens on client)")
    public ResponseEntity<ApiResponse<String>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully. Please discard your tokens."));
    }

    /**
     * GET /api/auth/verify-email?token=...
     * Verify user email address via token link.
     * Source: FR-AUTH-006
     */
    @GetMapping("/verify-email")
    @Operation(summary = "Verify email address")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.ok(ApiResponse.success("Email verified successfully. You can now log in."));
    }

    /**
     * POST /api/auth/forgot-password
     * Request a password reset email.
     */
    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset email")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        // Always return success (no email enumeration)
        return ResponseEntity.ok(ApiResponse.success(
                "If an account exists with this email, a password reset link has been sent."));
    }

    /**
     * POST /api/auth/reset-password
     * Reset password using a valid reset token.
     */
    @PostMapping("/reset-password")
    @Operation(summary = "Reset password with token")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully. You can now log in."));
    }

    /**
     * GET /api/auth/me
     * Get currently authenticated user's info.
     * Requires valid Bearer token.
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get current user info")
    public ResponseEntity<ApiResponse<TokenResponse.AuthUserDto>> getCurrentUser(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        TokenResponse.AuthUserDto user = authService.getCurrentUser(userId);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}
