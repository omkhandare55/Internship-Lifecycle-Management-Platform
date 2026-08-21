package com.vilp.auth.service;

import com.vilp.auth.dto.OtpDto;
import com.vilp.exception.AuthException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class OtpServiceTest {

    @Mock
    private JavaMailSender mailSender;

    private OtpService otpService;

    @BeforeEach
    void setUp() {
        otpService = new OtpService(mailSender);
        ReflectionTestUtils.setField(otpService, "activeProfile", "dev");
    }

    @Test
    @DisplayName("Should generate and dispatch email OTP successfully")
    void testSendEmailOtp() {
        OtpDto.SendEmailOtpRequest req = OtpDto.SendEmailOtpRequest.builder()
                .email("student@institution.edu")
                .purpose("REGISTRATION")
                .build();

        OtpDto.OtpResponse res = otpService.sendEmailOtp(req);

        assertNotNull(res);
        assertFalse(res.isVerified());
        assertEquals("student@institution.edu", res.getTarget());
        assertEquals(600L, res.getExpiresInSeconds());
    }

    @Test
    @DisplayName("Should verify OTP via dev bypass token in dev profile")
    void testVerifyOtpDevBypass() {
        OtpDto.VerifyOtpRequest req = OtpDto.VerifyOtpRequest.builder()
                .target("student@institution.edu")
                .otpCode("123456")
                .build();

        OtpDto.OtpResponse res = otpService.verifyOtp(req);

        assertNotNull(res);
        assertTrue(res.isVerified());
        assertTrue(res.getMessage().contains("Identity verified successfully"));
    }

    @Test
    @DisplayName("Should reject invalid OTP for unregistered target")
    void testVerifyOtpNotFound() {
        OtpDto.VerifyOtpRequest req = OtpDto.VerifyOtpRequest.builder()
                .target("unknown@institution.edu")
                .otpCode("999999")
                .build();

        AuthException ex = assertThrows(AuthException.class, () -> otpService.verifyOtp(req));
        assertEquals("INVALID_OTP", ex.getErrorCode());
    }

    @Test
    @DisplayName("Should enforce rate limit when OTP requests exceed threshold")
    void testRateLimiting() {
        OtpDto.SendEmailOtpRequest req = OtpDto.SendEmailOtpRequest.builder()
                .email("spammer@institution.edu")
                .purpose("VERIFICATION")
                .build();

        for (int i = 0; i < 5; i++) {
            otpService.sendEmailOtp(req);
        }

        AuthException ex = assertThrows(AuthException.class, () -> otpService.sendEmailOtp(req));
        assertEquals("RATE_LIMIT_EXCEEDED", ex.getErrorCode());
    }
}
