package com.vilp.ppo.controller;

import com.vilp.common.dto.ApiResponse;
import com.vilp.ppo.dto.PpoDto;
import com.vilp.ppo.service.PpoService;
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
@RequestMapping("/api/ppo")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "PPO Management", description = "Pre-Placement Offer (PPO) registration and institutional tracking")
public class PpoController {

    private final PpoService ppoService;

    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Company registers official Pre-Placement Offer (PPO)")
    public ResponseEntity<ApiResponse<PpoDto.PpoResponse>> createPpo(
            @RequestBody PpoDto.CreatePpoRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        UUID companyUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(ppoService.createPpo(companyUserId, req)));
    }

    @PostMapping("/{id}/respond")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Student responds to Pre-Placement Offer (ACCEPT / DECLINE)")
    public ResponseEntity<ApiResponse<PpoDto.PpoResponse>> respondToPpo(
            @PathVariable UUID id,
            @RequestBody PpoDto.RespondPpoRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        UUID studentUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(ppoService.respondToPpo(studentUserId, id, req)));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get PPO offers extended to current student")
    public ResponseEntity<ApiResponse<List<PpoDto.PpoResponse>>> getMyPpos(
            @AuthenticationPrincipal UserDetails ud) {
        UUID studentUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(ppoService.getMyPpos(studentUserId)));
    }

    @GetMapping("/registry")
    @PreAuthorize("hasAnyRole('TNP_OFFICER', 'TNP_HEAD', 'SUPER_ADMIN')")
    @Operation(summary = "Institutional Placement & PPO Registry (T&P)")
    public ResponseEntity<ApiResponse<Page<PpoDto.PpoResponse>>> getRegistry(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(ppoService.getRegistry(status, pageable)));
    }
}
