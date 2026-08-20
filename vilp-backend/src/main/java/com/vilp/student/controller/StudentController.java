package com.vilp.student.controller;

import com.vilp.common.dto.ApiResponse;
import com.vilp.student.dto.StudentDto;
import com.vilp.student.service.StudentService;
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

import java.util.UUID;

/**
 * Student Controller
 * Source: TRD §34 (Student endpoints)
 */
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Students", description = "Student profile management")
public class StudentController {

    private final StudentService studentService;

    /** POST /api/students/me — Create my student profile */
    @PostMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Create student profile")
    public ResponseEntity<ApiResponse<StudentDto.StudentResponse>> createProfile(
            @RequestBody StudentDto.CreateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(studentService.createProfile(userId, request)));
    }

    /** GET /api/students/me — Get my profile */
    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get my student profile")
    public ResponseEntity<ApiResponse<StudentDto.StudentResponse>> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(studentService.getMyProfile(userId)));
    }

    /** PUT /api/students/me — Update my profile */
    @PutMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Update student profile")
    public ResponseEntity<ApiResponse<StudentDto.StudentResponse>> updateProfile(
            @RequestBody StudentDto.UpdateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(studentService.updateProfile(userId, request)));
    }

    /** POST /api/students/me/skills/{skillId} — Add skill */
    @PostMapping("/me/skills/{skillId}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Add skill to profile")
    public ResponseEntity<ApiResponse<StudentDto.StudentResponse>> addSkill(
            @PathVariable Long skillId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(studentService.addSkill(userId, skillId)));
    }

    /** DELETE /api/students/me/skills/{skillId} — Remove skill */
    @DeleteMapping("/me/skills/{skillId}")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Remove skill from profile")
    public ResponseEntity<ApiResponse<StudentDto.StudentResponse>> removeSkill(
            @PathVariable Long skillId,
            @AuthenticationPrincipal UserDetails userDetails) {
        UUID userId = UUID.fromString(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(studentService.removeSkill(userId, skillId)));
    }

    /** GET /api/students/{id} — T&P/Mentor view a student */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('TNP_OFFICER','TNP_HEAD','MENTOR','SUPER_ADMIN')")
    @Operation(summary = "Get student by ID (T&P/Mentor)")
    public ResponseEntity<ApiResponse<StudentDto.StudentResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.success(studentService.getById(id)));
    }

    /** GET /api/students — T&P list all students (paginated) */
    @GetMapping
    @PreAuthorize("hasAnyRole('TNP_OFFICER','TNP_HEAD','SUPER_ADMIN','MENTOR')")
    @Operation(summary = "List/search students")
    public ResponseEntity<ApiResponse<Page<StudentDto.StudentResponse>>> listStudents(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String department,
            @PageableDefault(size = 20, sort = "fullName") Pageable pageable,
            @AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success(studentService.search(q, status, department, pageable)));
    }
}
