package com.vilp.application.controller;

import com.vilp.application.dto.ApplicationDto;
import com.vilp.application.service.ApplicationService;
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

import java.util.UUID;

/**
 * Application Controller
 * Source: TRD §34 (Application endpoints)
 */
@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Applications", description = "Internship application management")
public class ApplicationController {

    private final ApplicationService applicationService;

    /** POST /api/applications — Student applies */
    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Apply to an internship")
    public ResponseEntity<ApiResponse<ApplicationDto.ApplicationResponse>> apply(
            @RequestBody ApplicationDto.ApplyRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(applicationService.apply(UUID.fromString(ud.getUsername()), req)));
    }

    /** GET /api/applications/mine — Student views own applications */
    @GetMapping("/mine")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "List my applications")
    public ResponseEntity<ApiResponse<Page<ApplicationDto.ApplicationResponse>>> myApplications(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(
                applicationService.myApplications(UUID.fromString(ud.getUsername()), pageable)));
    }

    /** DELETE /api/applications/{id} — Student withdraws */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Withdraw application")
    public ResponseEntity<ApiResponse<String>> withdraw(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails ud) {
        applicationService.withdraw(UUID.fromString(ud.getUsername()), id);
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn successfully"));
    }

    /** GET /api/applications/internship/{id} — Company views applicants */
    @GetMapping("/internship/{id}")
    @PreAuthorize("hasAnyRole('COMPANY','TNP_OFFICER','TNP_HEAD','SUPER_ADMIN')")
    @Operation(summary = "List applicants for an internship")
    public ResponseEntity<ApiResponse<Page<ApplicationDto.ApplicationResponse>>> listForInternship(
            @PathVariable UUID id,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                applicationService.listForInternship(id, status, pageable)));
    }

    /** PUT /api/applications/{id}/status — Company updates status */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Update application status (Company)")
    public ResponseEntity<ApiResponse<ApplicationDto.ApplicationResponse>> updateStatus(
            @PathVariable UUID id,
            @RequestBody ApplicationDto.StatusUpdateRequest req) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.updateStatus(id, req)));
    }
}
