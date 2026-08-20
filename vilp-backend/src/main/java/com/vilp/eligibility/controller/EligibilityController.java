package com.vilp.eligibility.controller;

import com.vilp.common.dto.ApiResponse;
import com.vilp.eligibility.dto.EligibilityCheckResponse;
import com.vilp.eligibility.service.EligibilityEngine;
import com.vilp.exception.ResourceNotFoundException;
import com.vilp.student.entity.Student;
import com.vilp.student.repository.StudentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/internships")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Eligibility Engine", description = "Deterministic eligibility verification per TRD §19")
public class EligibilityController {

    private final EligibilityEngine eligibilityEngine;
    private final StudentRepository studentRepository;

    @GetMapping("/{id}/eligibility/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Check current student's eligibility for an internship offering")
    public ResponseEntity<ApiResponse<EligibilityCheckResponse>> checkMyEligibility(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails ud) {

        UUID userId = UUID.fromString(ud.getUsername());
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found. Complete profile first."));

        EligibilityCheckResponse response = eligibilityEngine.evaluate(student.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{id}/eligibility/check")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Check deterministic eligibility for specified studentId")
    public ResponseEntity<ApiResponse<EligibilityCheckResponse>> checkEligibility(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {

        String studentIdStr = body.get("studentId");
        if (studentIdStr == null || studentIdStr.isBlank()) {
            throw new IllegalArgumentException("studentId is required in request body");
        }

        UUID studentId = UUID.fromString(studentIdStr);
        EligibilityCheckResponse response = eligibilityEngine.evaluate(studentId, id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
