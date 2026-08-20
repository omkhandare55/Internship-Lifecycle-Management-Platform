package com.vilp.evaluation.controller;

import com.vilp.common.dto.ApiResponse;
import com.vilp.evaluation.dto.EvaluationDto;
import com.vilp.evaluation.service.EvaluationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Evaluations", description = "Midterm and Final internship evaluations")
public class EvaluationController {

    private final EvaluationService evaluationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('MENTOR', 'COMPANY', 'TNP_OFFICER', 'TNP_HEAD', 'SUPER_ADMIN')")
    @Operation(summary = "Submit Midterm or Final evaluation for an intern")
    public ResponseEntity<ApiResponse<EvaluationDto.EvaluationResponse>> submitEvaluation(
            @RequestBody EvaluationDto.SubmitEvaluationRequest req,
            @AuthenticationPrincipal UserDetails ud) {
        UUID evaluatorUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(evaluationService.submitEvaluation(evaluatorUserId, req)));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Student views all received evaluations")
    public ResponseEntity<ApiResponse<List<EvaluationDto.EvaluationResponse>>> getMyEvaluations(
            @AuthenticationPrincipal UserDetails ud) {
        UUID studentUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(evaluationService.getStudentEvaluations(studentUserId)));
    }

    @GetMapping("/internship/{internshipId}")
    @PreAuthorize("hasAnyRole('MENTOR', 'COMPANY', 'TNP_OFFICER', 'TNP_HEAD', 'SUPER_ADMIN')")
    @Operation(summary = "Get all evaluations for an internship")
    public ResponseEntity<ApiResponse<List<EvaluationDto.EvaluationResponse>>> getInternshipEvaluations(
            @PathVariable UUID internshipId) {
        return ResponseEntity.ok(ApiResponse.success(evaluationService.getInternshipEvaluations(internshipId)));
    }
}
