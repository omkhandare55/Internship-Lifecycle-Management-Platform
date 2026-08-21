package com.vilp.common.controller;

import com.vilp.analytics.dto.AnalyticsDto;
import com.vilp.analytics.service.AnalyticsService;
import com.vilp.common.dto.ApiResponse;
import com.vilp.internship.dto.InternshipDto;
import com.vilp.internship.service.InternshipService;
import com.vilp.student.entity.Department;
import com.vilp.student.entity.Skill;
import com.vilp.student.repository.DepartmentRepository;
import com.vilp.student.repository.SkillRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Tag(name = "Public Reference Data", description = "Public reference endpoints for departments, skills, internships, and statistics")
public class PublicDataController {

    private final DepartmentRepository departmentRepository;
    private final SkillRepository skillRepository;
    private final InternshipService internshipService;
    private final AnalyticsService analyticsService;

    @GetMapping("/departments")
    @Operation(summary = "Get list of all departments")
    public ResponseEntity<ApiResponse<List<Department>>> getDepartments() {
        return ResponseEntity.ok(ApiResponse.success(departmentRepository.findAll()));
    }

    @GetMapping("/skills")
    @Operation(summary = "Get list of all skills")
    public ResponseEntity<ApiResponse<List<Skill>>> getSkills() {
        return ResponseEntity.ok(ApiResponse.success(skillRepository.findAll()));
    }

    @GetMapping("/internships")
    @Operation(summary = "List open internships (public, no auth required)")
    public ResponseEntity<ApiResponse<Page<InternshipDto.InternshipResponse>>> getPublicInternships(
            @PageableDefault(size = 20, sort = "createdAt",
                    direction = org.springframework.data.domain.Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(internshipService.listOpen(pageable)));
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get public institutional statistics and KPIs")
    public ResponseEntity<ApiResponse<AnalyticsDto.InstitutionalOverview>> getPublicStatistics() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getOverview()));
    }
}
