package com.vilp.ai.controller;

import com.vilp.ai.dto.AiDto;
import com.vilp.ai.service.AiService;
import com.vilp.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "AI Career Advisor", description = "Advisory AI recommendation gateway per TRD §21-§24")
public class AiController {

    private final AiService aiService;

    @GetMapping("/recommendations")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get personalized AI internship recommendations sorted by match score")
    public ResponseEntity<ApiResponse<List<AiDto.InternshipRecommendation>>> getRecommendations(
            @AuthenticationPrincipal UserDetails ud) {
        UUID studentUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(aiService.getRecommendations(studentUserId)));
    }

    @GetMapping("/resume-score")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get automated profile & resume diagnostic score with improvement tips")
    public ResponseEntity<ApiResponse<AiDto.ResumeScoreResponse>> getResumeScore(
            @AuthenticationPrincipal UserDetails ud) {
        UUID studentUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(aiService.evaluateResume(studentUserId)));
    }

    @GetMapping("/skill-gap/{internshipId}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Analyze skill gaps for a specific internship offering with learning roadmap")
    public ResponseEntity<ApiResponse<AiDto.SkillGapResponse>> getSkillGap(
            @PathVariable UUID internshipId,
            @AuthenticationPrincipal UserDetails ud) {
        UUID studentUserId = UUID.fromString(ud.getUsername());
        return ResponseEntity.ok(ApiResponse.success(aiService.analyzeSkillGap(studentUserId, internshipId)));
    }
}
