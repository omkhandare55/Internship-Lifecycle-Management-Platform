package com.vilp.auth.controller;

import com.vilp.auth.dto.OtpDto;
import com.vilp.auth.service.OtpService;
import com.vilp.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/otp")
@RequiredArgsConstructor
@Tag(name = "Authentication & OTP", description = "Multi-factor dual OTP verification endpoints")
public class OtpController {

    private final OtpService otpService;

    @PostMapping("/send-email")
    @Operation(summary = "Dispatch 6-digit verification code to email")
    public ResponseEntity<ApiResponse<OtpDto.OtpResponse>> sendEmailOtp(@Valid @RequestBody OtpDto.SendEmailOtpRequest req) {
        OtpDto.OtpResponse response = otpService.sendEmailOtp(req);
        return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
    }

    @PostMapping("/send-mobile")
    @Operation(summary = "Dispatch 6-digit verification code via SMS to mobile number")
    public ResponseEntity<ApiResponse<OtpDto.OtpResponse>> sendMobileOtp(@Valid @RequestBody OtpDto.SendMobileOtpRequest req) {
        OtpDto.OtpResponse response = otpService.sendMobileOtp(req);
        return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
    }

    @PostMapping("/verify")
    @Operation(summary = "Validate 6-digit OTP code")
    public ResponseEntity<ApiResponse<OtpDto.OtpResponse>> verifyOtp(@Valid @RequestBody OtpDto.VerifyOtpRequest req) {
        OtpDto.OtpResponse response = otpService.verifyOtp(req);
        return ResponseEntity.ok(ApiResponse.success(response.getMessage(), response));
    }
}
