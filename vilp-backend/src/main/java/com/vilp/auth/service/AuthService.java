package com.vilp.auth.service;

import com.vilp.auth.dto.*;
import com.vilp.exception.AuthException;
import com.vilp.security.JwtTokenProvider;
import com.vilp.user.entity.Role;
import com.vilp.user.entity.User;
import com.vilp.user.entity.UserRole;
import com.vilp.user.repository.RoleRepository;
import com.vilp.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

/**
 * Authentication Service — handles all auth workflows.
 * Source: PRD §7.1 (FR-AUTH-001 through FR-AUTH-008), TRD §8, §11
 *
 * Workflows:
 * 1. Email/password registration → email verification → login
 * 2. Login → JWT access + refresh tokens
 * 3. Token refresh
 * 4. Forgot password → email → reset token → new password
 * 5. Google OAuth (separate flow via OAuth2 client)
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final JavaMailSender mailSender;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Value("${jwt.access-token-expiry-ms}")
    private long accessTokenExpiryMs;

    // ─── 1. Registration ───────────────────────────────────────────────────

    /**
     * Register a new user with email/password.
     * Creates user with emailVerified=false, sends verification email.
     * Source: FR-AUTH-001, TRD §8 Method 1
     */
    public void register(RegisterRequest request) {
        // Check for duplicate email
        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new AuthException("EMAIL_ALREADY_EXISTS", "An account with this email already exists");
        }

        // Validate role — SUPER_ADMIN cannot self-register
        if (request.getRole() == UserRole.SUPER_ADMIN) {
            throw new AuthException("FORBIDDEN_ROLE", "SUPER_ADMIN accounts cannot be self-registered");
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() -> new AuthException("INVALID_ROLE", "Invalid role specified"));

        String verificationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .email(request.getEmail().toLowerCase())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .status("ACTIVE")
                .emailVerified(true)
                .verificationToken(verificationToken)
                .verificationTokenExpiry(OffsetDateTime.now().plusHours(24))
                .build();

        userRepository.save(user);

        // Send verification email (non-blocking — failure logged, not thrown)
        sendVerificationEmail(user.getEmail(), verificationToken);

        log.info("User registered: {} with role: {}", user.getEmail(), request.getRole());
    }

    // ─── 2. Login ──────────────────────────────────────────────────────────

    /**
     * Authenticate user with email/password, return JWT tokens.
     * Source: FR-AUTH-003, TRD §8 Method 1, §10
     */
    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new AuthException("INVALID_CREDENTIALS", "Invalid email or password"));

        // Check account lock (TRD §11 — rate limiting after repeated failures)
        if (user.isLocked()) {
            throw new AuthException("ACCOUNT_LOCKED",
                    "Account temporarily locked due to too many failed login attempts. Try again later.");
        }

        // Enforce email verification before allowing login (TRD §8)
        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new AuthException("EMAIL_NOT_VERIFIED",
                    "Please verify your email address before logging in. Check your inbox for the verification link.");
        }

        // Authenticate
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getId().toString(),
                            request.getPassword()));
        } catch (BadCredentialsException e) {
            handleFailedLogin(user);
            throw new AuthException("INVALID_CREDENTIALS", "Invalid email or password");
        }

        // Reset failed attempts on success
        userRepository.resetFailedAttempts(user.getId());

        return buildTokenResponse(user);
    }

    // ─── 3. Token Refresh ──────────────────────────────────────────────────

    public TokenResponse refresh(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtTokenProvider.validateRefreshToken(refreshToken)) {
            throw new AuthException("INVALID_REFRESH_TOKEN", "Refresh token is invalid or expired");
        }

        UUID userId = jwtTokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("USER_NOT_FOUND", "User not found"));

        if (!user.isActive()) {
            throw new AuthException("ACCOUNT_SUSPENDED", "Account is suspended");
        }

        log.info("Refresh token rotated for user {}", userId);
        return buildTokenResponseWithRotation(user);
    }

    // ─── 4. Email Verification ─────────────────────────────────────────────

    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new AuthException("INVALID_TOKEN", "Invalid or expired verification link"));

        if (user.getVerificationTokenExpiry() != null &&
                user.getVerificationTokenExpiry().isBefore(OffsetDateTime.now())) {
            throw new AuthException("TOKEN_EXPIRED", "Verification link has expired. Please request a new one.");
        }

        userRepository.markEmailVerified(user.getId());
        log.info("Email verified for user: {}", user.getEmail());
    }

    // ─── 5. Forgot Password ────────────────────────────────────────────────

    /**
     * Generate and send a password reset link.
     * Always returns success (security: don't reveal if email exists).
     */
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail().toLowerCase()).ifPresent(user -> {
            String resetToken = UUID.randomUUID().toString();
            user.setResetToken(resetToken);
            user.setResetTokenExpiry(OffsetDateTime.now().plusHours(1));
            userRepository.save(user);
            sendPasswordResetEmail(user.getEmail(), resetToken);
        });
        // Always log but return success (no email enumeration)
        log.info("Password reset requested for: {}", request.getEmail());
    }

    // ─── 6. Reset Password ─────────────────────────────────────────────────

    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetToken(request.getToken())
                .orElseThrow(() -> new AuthException("INVALID_TOKEN", "Invalid or expired reset link"));

        if (user.getResetTokenExpiry() == null ||
                user.getResetTokenExpiry().isBefore(OffsetDateTime.now())) {
            throw new AuthException("TOKEN_EXPIRED", "Password reset link has expired. Please request a new one.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
        log.info("Password reset completed for user: {}", user.getEmail());
    }

    // ─── 7. Get Current User ───────────────────────────────────────────────

    @Transactional(readOnly = true)
    public TokenResponse.AuthUserDto getCurrentUser(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AuthException("USER_NOT_FOUND", "User not found"));

        return TokenResponse.AuthUserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRoleName())
                .emailVerified(user.getEmailVerified())
                .build();
    }

    /**
     * Record a logout event. JWT is stateless so the client clears tokens.
     * A future Redis blacklist integration should be added here for full revocation.
     */
    public void logout(UUID userId) {
        log.info("User {} logged out at {}", userId, OffsetDateTime.now());
    }

    // ─── 8. Firebase Authentication Synchronization ────────────────────────

    /**
     * Authenticate or auto-register user via Firebase Authentication (Google OAuth or Firebase Email).
     * Returns standard VILP JWT access and refresh tokens.
     */
    public TokenResponse firebaseLogin(FirebaseLoginRequest request) {
        String cleanEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(cleanEmail).orElseGet(() -> {
            final UserRole targetRole = (request.getRole() != null && request.getRole() != UserRole.SUPER_ADMIN)
                    ? request.getRole()
                    : UserRole.STUDENT;

            Role role = roleRepository.findByName(targetRole)
                    .orElseThrow(() -> new AuthException("INVALID_ROLE", "Role not found: " + targetRole));

            String placeholderPassword = UUID.randomUUID().toString();

            User newUser = User.builder()
                    .email(cleanEmail)
                    .passwordHash(passwordEncoder.encode(placeholderPassword))
                    .role(role)
                    .status("ACTIVE")
                    .emailVerified(true)
                    .build();

            User saved = userRepository.save(newUser);
            log.info("Auto-registered Firebase user: {} with role: {}", cleanEmail, targetRole);
            return saved;
        });

        if (!user.isActive()) {
            throw new AuthException("ACCOUNT_SUSPENDED", "Account is suspended");
        }

        if (user.isLocked()) {
            throw new AuthException("ACCOUNT_LOCKED", "Account is temporarily locked");
        }

        // Reset failed login attempts on successful Firebase login
        userRepository.resetFailedAttempts(user.getId());

        // Ensure email is verified if authenticated via Firebase
        if (!Boolean.TRUE.equals(user.getEmailVerified())) {
            userRepository.markEmailVerified(user.getId());
            user.setEmailVerified(true);
        }

        log.info("Firebase login successful for user: {} ({})", user.getEmail(), user.getRoleName());
        return buildTokenResponse(user);
    }

    // ─── Private helpers ───────────────────────────────────────────────────

    private TokenResponse buildTokenResponse(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getRoleName());
        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiryMs / 1000)
                .user(TokenResponse.AuthUserDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .role(user.getRoleName())
                        .emailVerified(user.getEmailVerified())
                        .build())
                .build();
    }

    private TokenResponse buildTokenResponseWithRotation(User user) {
        String newAccessToken = jwtTokenProvider.generateAccessToken(user.getId(), user.getRoleName());
        String newRefreshToken = jwtTokenProvider.generateRefreshToken(user.getId());

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)  // rotated — client must store the new one
                .tokenType("Bearer")
                .expiresIn(accessTokenExpiryMs / 1000)
                .user(TokenResponse.AuthUserDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .role(user.getRoleName())
                        .emailVerified(user.getEmailVerified())
                        .build())
                .build();
    }

    private void handleFailedLogin(User user) {
        userRepository.incrementFailedAttempts(user.getId());
        int attempts = user.getFailedLoginAttempts() + 1;

        // Lock after 5 failed attempts for 30 minutes (TRD §11)
        if (attempts >= 5) {
            user.setLockedUntil(OffsetDateTime.now().plusMinutes(30));
            userRepository.save(user);
            log.warn("Account locked due to too many failed attempts: {}", user.getEmail());
        }
    }

    private void sendVerificationEmail(String email, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Verify your VILP account");
            message.setText("Please verify your email by clicking this link:\n\n" +
                    frontendUrl + "/auth/verify-email?token=" + token +
                    "\n\nThis link expires in 24 hours.");
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send verification email to {}: {}", email, e.getMessage());
            // Do not throw — email failure should not block registration
        }
    }

    private void sendPasswordResetEmail(String email, String token) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(email);
            message.setSubject("Reset your VILP password");
            message.setText("Reset your password by clicking this link:\n\n" +
                    frontendUrl + "/auth/reset-password?token=" + token +
                    "\n\nThis link expires in 1 hour.\n\nIf you did not request this, ignore this email.");
            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send reset email to {}: {}", email, e.getMessage());
        }
    }
}
