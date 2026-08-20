package com.vilp.verification.controller;

import com.vilp.common.dto.ApiResponse;
import com.vilp.verification.dto.VerificationDto;
import com.vilp.verification.service.VerificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/verifications")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Verifications", description = "Universal verification queue and workflow")
public class VerificationController {

    private final VerificationService verificationService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Submit an entity for verification")
    public ResponseEntity<ApiResponse<VerificationDto.VerificationResponse>> submit(
            @RequestBody VerificationDto.SubmitVerificationRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        UUID submitterId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(verificationService.submit(submitterId, req)));
    }

    @PostMapping("/{id}/process")
    @PreAuthorize("hasAnyRole('TNP_OFFICER', 'TNP_HEAD', 'SUPER_ADMIN')")
    @Operation(summary = "Process verification decision (Approve/Reject)")
    public ResponseEntity<ApiResponse<VerificationDto.VerificationResponse>> process(
            @PathVariable UUID id,
            @RequestBody VerificationDto.ProcessVerificationRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        UUID reviewerId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(verificationService.process(reviewerId, id, req)));
    }

    @GetMapping("/queue")
    @PreAuthorize("hasAnyRole('TNP_OFFICER', 'TNP_HEAD', 'SUPER_ADMIN')")
    @Operation(summary = "Get verification queue with optional filters")
    public ResponseEntity<ApiResponse<Page<VerificationDto.VerificationResponse>>> getQueue(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(verificationService.getQueue(entityType, status, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get verification details")
    public ResponseEntity<ApiResponse<VerificationDto.VerificationResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(verificationService.getById(id)));
    }
}
