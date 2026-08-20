package com.vilp.internship.controller;

import com.vilp.common.dto.ApiResponse;
import com.vilp.internship.dto.InternshipDto;
import com.vilp.internship.service.InternshipService;
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
 * Internship Controller
 * Source: TRD §34 (Internship endpoints)
 */
@RestController
@RequestMapping("/api/internships")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Internships", description = "Internship listing, posting and verification")
public class InternshipController {

    private final InternshipService internshipService;

    /** GET /api/internships — Open internships visible to students */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List open internships")
    public ResponseEntity<ApiResponse<Page<InternshipDto.InternshipResponse>>> listOpen(
            @PageableDefault(size = 20) Pageable pageable,
            @RequestParam(required = false) String status,
            @AuthenticationPrincipal UserDetails ud) {
        // T&P / Admin can see all; students see only open
        Page<InternshipDto.InternshipResponse> result;
        if (status != null) {
            result = internshipService.listAll(status, pageable);
        } else {
            result = internshipService.listOpen(pageable);
        }
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /** GET /api/internships/{id} */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get internship by ID")
    public ResponseEntity<ApiResponse<InternshipDto.InternshipResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(internshipService.getById(id)));
    }

    /** POST /api/internships — Company posts internship */
    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Create internship posting")
    public ResponseEntity<ApiResponse<InternshipDto.InternshipResponse>> create(
            @RequestBody InternshipDto.CreateInternshipRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(internshipService.create(UUID.fromString(ud.getUsername()), req)));
    }

    /** GET /api/internships/mine — Company: list own internships */
    @GetMapping("/mine")
    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "List my company's internships")
    public ResponseEntity<ApiResponse<Page<InternshipDto.InternshipResponse>>> listMine(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(
                internshipService.listByCompany(UUID.fromString(ud.getUsername()), pageable)));
    }

    /** POST /api/internships/{id}/publish — Company: publish draft */
    @PostMapping("/{id}/publish")
    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Publish internship for T&P review")
    public ResponseEntity<ApiResponse<InternshipDto.InternshipResponse>> publish(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(
                internshipService.publish(UUID.fromString(ud.getUsername()), id)));
    }

    /** POST /api/internships/{id}/verify — T&P: verify or reject */
    @PostMapping("/{id}/verify")
    @PreAuthorize("hasAnyRole('TNP_OFFICER','TNP_HEAD','SUPER_ADMIN')")
    @Operation(summary = "Verify or reject internship (T&P)")
    public ResponseEntity<ApiResponse<InternshipDto.InternshipResponse>> verify(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ApiResponse.success(
                internshipService.verify(id, body.get("status"))));
    }
}
