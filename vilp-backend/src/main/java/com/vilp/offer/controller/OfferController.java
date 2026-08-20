package com.vilp.offer.controller;

import com.vilp.common.dto.ApiResponse;
import com.vilp.offer.dto.OfferDto;
import com.vilp.offer.service.OfferService;
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
@RequestMapping("/api/offers")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Offers", description = "Offer letter extension and student response management")
public class OfferController {

    private final OfferService offerService;

    @PostMapping
    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Company extends formal internship offer")
    public ResponseEntity<ApiResponse<OfferDto.OfferResponse>> createOffer(
            @RequestBody OfferDto.CreateOfferRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        UUID companyUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(offerService.createOffer(companyUserId, req)));
    }

    @PostMapping("/{id}/respond")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Student responds to offer (ACCEPT / REJECT)")
    public ResponseEntity<ApiResponse<OfferDto.OfferResponse>> respondToOffer(
            @PathVariable UUID id,
            @RequestBody OfferDto.RespondOfferRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        UUID studentUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(offerService.respondToOffer(studentUserId, id, req)));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get offers extended to the logged-in student")
    public ResponseEntity<ApiResponse<List<OfferDto.OfferResponse>>> getMyStudentOffers(
            @AuthenticationPrincipal UserDetails ud) {
        UUID studentUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(offerService.getMyStudentOffers(studentUserId)));
    }

    @GetMapping("/company")
    @PreAuthorize("hasRole('COMPANY')")
    @Operation(summary = "Get offers extended by logged-in company")
    public ResponseEntity<ApiResponse<Page<OfferDto.OfferResponse>>> getMyCompanyOffers(
            @PageableDefault(size = 20) Pageable pageable,
            @AuthenticationPrincipal UserDetails ud) {
        UUID companyUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(offerService.getMyCompanyOffers(companyUserId, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get offer details by ID")
    public ResponseEntity<ApiResponse<OfferDto.OfferResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(offerService.getById(id)));
    }
}
