package com.vilp.logbook.controller;

import com.vilp.common.dto.ApiResponse;
import com.vilp.logbook.dto.WeeklyReportDto;
import com.vilp.logbook.service.WeeklyReportService;
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
@RequestMapping("/api/logbooks")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Logbooks & Weekly Reports", description = "Student periodic logbooks and mentor evaluations")
public class WeeklyReportController {

    private final WeeklyReportService weeklyReportService;

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Student submits weekly logbook report")
    public ResponseEntity<ApiResponse<WeeklyReportDto.WeeklyReportResponse>> submitReport(
            @RequestBody WeeklyReportDto.SubmitReportRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        UUID studentUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(weeklyReportService.submitReport(studentUserId, req)));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get all weekly reports submitted by logged-in student")
    public ResponseEntity<ApiResponse<List<WeeklyReportDto.WeeklyReportResponse>>> getMyReports(
            @AuthenticationPrincipal UserDetails ud) {
        UUID studentUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(weeklyReportService.getMyReports(studentUserId)));
    }

    @GetMapping("/hours/approved")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get total approved internship hours for current student")
    public ResponseEntity<ApiResponse<Integer>> getTotalApprovedHours(
            @AuthenticationPrincipal UserDetails ud) {
        UUID studentUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(weeklyReportService.getTotalApprovedHours(studentUserId)));
    }

    @GetMapping("/review-queue")
    @PreAuthorize("hasAnyRole('MENTOR', 'TNP_OFFICER', 'TNP_HEAD', 'SUPER_ADMIN')")
    @Operation(summary = "Mentor review queue for weekly logbooks")
    public ResponseEntity<ApiResponse<Page<WeeklyReportDto.WeeklyReportResponse>>> getReviewQueue(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(weeklyReportService.getReviewQueue(status, pageable)));
    }

    @PostMapping("/{id}/review")
    @PreAuthorize("hasAnyRole('MENTOR', 'TNP_OFFICER', 'TNP_HEAD', 'SUPER_ADMIN')")
    @Operation(summary = "Mentor reviews and grades student logbook")
    public ResponseEntity<ApiResponse<WeeklyReportDto.WeeklyReportResponse>> reviewReport(
            @PathVariable UUID id,
            @RequestBody WeeklyReportDto.ReviewReportRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        UUID reviewerUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(weeklyReportService.reviewReport(reviewerUserId, id, req)));
    }
}
