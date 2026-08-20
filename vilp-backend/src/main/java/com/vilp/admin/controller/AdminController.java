package com.vilp.admin.controller;

import com.vilp.admin.dto.AdminDto;
import com.vilp.admin.service.AdminService;
import com.vilp.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@PreAuthorize("hasRole('SUPER_ADMIN')")
@Tag(name = "Super Admin", description = "Platform-wide user management and system administration")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    @Operation(summary = "List all platform users with role mappings")
    public ResponseEntity<ApiResponse<Page<AdminDto.UserSummary>>> listUsers(
            @PageableDefault(size = 30) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(adminService.listUsers(pageable)));
    }

    @PutMapping("/users/{userId}/status")
    @Operation(summary = "Toggle user account active/disabled status")
    public ResponseEntity<ApiResponse<AdminDto.UserSummary>> toggleUserStatus(
            @PathVariable UUID userId,
            @RequestBody AdminDto.ToggleUserStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.success(adminService.toggleUserStatus(userId, req.getEnabled())));
    }

    @PostMapping("/users/{userId}/roles")
    @Operation(summary = "Add or remove role from user")
    public ResponseEntity<ApiResponse<AdminDto.UserSummary>> updateUserRole(
            @PathVariable UUID userId,
            @RequestBody AdminDto.UpdateUserRoleRequest req) {
        return ResponseEntity.ok(ApiResponse.success(adminService.updateUserRole(userId, req)));
    }
}
