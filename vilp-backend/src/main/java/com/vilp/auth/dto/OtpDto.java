package com.vilp.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class OtpDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SendEmailOtpRequest {
        @NotBlank(message = "Email is required")
        private String email;
        private String purpose; // REGISTRATION, PASSWORD_RESET, VERIFICATION
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SendMobileOtpRequest {
        @NotBlank(message = "Mobile number is required")
        private String mobileNumber;
        private String purpose;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class VerifyOtpRequest {
        @NotBlank(message = "Target identifier (email or mobile) is required")
        private String target;
        @NotBlank(message = "OTP code is required")
        private String otpCode;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OtpResponse {
        private boolean verified;
        private String message;
        private String target;
        private Long expiresInSeconds;
    }
}
