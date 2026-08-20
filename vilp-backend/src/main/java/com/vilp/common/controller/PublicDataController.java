package com.vilp.common.controller;

import com.vilp.common.dto.ApiResponse;
import com.vilp.student.entity.Department;
import com.vilp.student.entity.Skill;
import com.vilp.student.repository.DepartmentRepository;
import com.vilp.student.repository.SkillRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Tag(name = "Public Reference Data", description = "Public reference endpoints for departments, skills, etc.")
public class PublicDataController {

    private final DepartmentRepository departmentRepository;
    private final SkillRepository skillRepository;

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
}
