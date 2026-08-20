package com.vilp.certificate.controller;

import com.vilp.certificate.dto.CertificateDto;
import com.vilp.certificate.service.CertificateService;
import com.vilp.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Completion Certificates", description = "Cryptographically verifiable internship completion certificates")
public class CertificateController {

    private final CertificateService certificateService;

    @PostMapping("/certificates")
    @PreAuthorize("hasAnyRole('TNP_OFFICER', 'TNP_HEAD', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Issue official completion certificate upon internship finalization")
    public ResponseEntity<ApiResponse<CertificateDto.CertificateResponse>> issueCertificate(
            @RequestBody CertificateDto.IssueCertificateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(certificateService.issueCertificate(req)));
    }

    @GetMapping("/certificates/mine")
    @PreAuthorize("hasRole('STUDENT')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "Get all completion certificates issued to the logged-in student")
    public ResponseEntity<ApiResponse<List<CertificateDto.CertificateResponse>>> getMyCertificates(
            @AuthenticationPrincipal UserDetails ud) {
        UUID studentUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(certificateService.getMyCertificates(studentUserId)));
    }

    @GetMapping("/certificates")
    @PreAuthorize("hasAnyRole('TNP_OFFICER', 'TNP_HEAD', 'SUPER_ADMIN')")
    @SecurityRequirement(name = "Bearer Authentication")
    @Operation(summary = "List all issued certificates (T&P)")
    public ResponseEntity<ApiResponse<Page<CertificateDto.CertificateResponse>>> listAll(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(certificateService.listAll(pageable)));
    }

    @GetMapping("/public/certificates/verify/{certificateNumber}")
    @Operation(summary = "Public verification of internship certificate validity via token or QR code")
    public ResponseEntity<ApiResponse<CertificateDto.CertificateResponse>> verifyCertificate(
            @PathVariable String certificateNumber) {
        return ResponseEntity.ok(ApiResponse.success(certificateService.getByCertificateNumber(certificateNumber)));
    }
}
