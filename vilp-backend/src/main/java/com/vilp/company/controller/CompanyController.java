package com.vilp.company.controller;

import com.vilp.common.dto.ApiResponse;
import com.vilp.company.dto.CompanyDto;
import com.vilp.company.service.CompanyService;
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

import java.util.Map;
import java.util.UUID;

/**
 * Company Controller
 * Source: TRD §34 (Company endpoints)
 */
@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Companies", description = "Company profile and verification management")
public class CompanyController {

    private final CompanyService companyService;

    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Create company profile")
    public ResponseEntity<ApiResponse<CompanyDto.CompanyResponse>> create(
            @RequestBody CompanyDto.CreateCompanyRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(companyService.create(UUID.fromString(ud.getUsername()), req)));
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Get my company profile")
    public ResponseEntity<ApiResponse<CompanyDto.CompanyResponse>> getMyProfile(
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(
                companyService.getMyProfile(UUID.fromString(ud.getUsername()))));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Update my company profile")
    public ResponseEntity<ApiResponse<CompanyDto.CompanyResponse>> update(
            @RequestBody CompanyDto.UpdateCompanyRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(
                companyService.update(UUID.fromString(ud.getUsername()), req)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TNP_OFFICER','TNP_HEAD','SUPER_ADMIN')")
    @Operation(summary = "Get company by ID (T&P)")
    public ResponseEntity<ApiResponse<CompanyDto.CompanyResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(companyService.getById(id)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('TNP_OFFICER','TNP_HEAD','SUPER_ADMIN')")
    @Operation(summary = "List all companies (T&P, paginated)")
    public ResponseEntity<ApiResponse<Page<CompanyDto.CompanyResponse>>> listAll(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false) String status) {
        Page<CompanyDto.CompanyResponse> result = status != null
                ? companyService.listByStatus(status, pageable)
                : companyService.listAll(pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    @PostMapping("/{id}/verify")
    @PreAuthorize("hasAnyRole('TNP_OFFICER','TNP_HEAD','SUPER_ADMIN')")
    @Operation(summary = "Verify or reject a company (T&P)")
    public ResponseEntity<ApiResponse<CompanyDto.CompanyResponse>> verify(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");    // VERIFIED | REJECTED | SUSPENDED
        String notes     = body.get("notes");
        return ResponseEntity.ok(ApiResponse.success(companyService.verify(id, newStatus, notes)));
    }
}
