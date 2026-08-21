package com.vilp.offer.controller;

import com.vilp.common.dto.ApiResponse;
import com.vilp.offer.dto.NocDto;
import com.vilp.offer.service.NocService;
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
@RequestMapping("/api/noc")
@RequiredArgsConstructor
@Tag(name = "NOC Management", description = "Institutional No Objection Certificate requests and approvals")
public class NocController {

    private final NocService nocService;

    @GetMapping("/queue")
    @PreAuthorize("hasAnyRole('TNP_OFFICER', 'TNP_HEAD', 'MENTOR', 'SUPER_ADMIN', 'STUDENT')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get pending institutional NOC approval queue")
    public ResponseEntity<ApiResponse<Page<NocDto.NocResponse>>> getQueue(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(nocService.getQueue(status, pageable)));
    }

    @PostMapping("/{id}/process")
    @PreAuthorize("hasAnyRole('TNP_OFFICER', 'TNP_HEAD', 'MENTOR', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Approve or Reject institutional NOC request")
    public ResponseEntity<ApiResponse<NocDto.NocResponse>> process(
            @PathVariable UUID id,
            @RequestBody NocDto.ProcessNocRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        UUID reviewerUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(nocService.processNoc(reviewerUserId, id, req)));
    }

    @GetMapping("/offer/{offerId}")
    @PreAuthorize("isAuthenticated()")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get NOC request for an accepted offer")
    public ResponseEntity<ApiResponse<NocDto.NocResponse>> getByOfferId(@PathVariable UUID offerId) {
        return ResponseEntity.ok(ApiResponse.success(nocService.getByOfferId(offerId)));
    }

    @GetMapping("/verify/{verificationCode}")
    @Operation(summary = "Public verification of institutional NOC validity by code/QR")
    public ResponseEntity<ApiResponse<NocDto.NocResponse>> verifyPublicNoc(@PathVariable String verificationCode) {
        return ResponseEntity.ok(ApiResponse.success(nocService.getByVerificationCode(verificationCode)));
    }
}
