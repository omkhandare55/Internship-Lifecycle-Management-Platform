package com.vilp.audit.controller;

import com.vilp.audit.dto.AuditLogDto;
import com.vilp.audit.service.AuditLogService;
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

@RestController
@RequestMapping("/api/audit")
@RequiredArgsConstructor
@SecurityRequirement(name = "Bearer Authentication")
@Tag(name = "Audit Logs", description = "System and compliance event audit trails")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasAnyRole('TNP_OFFICER', 'TNP_HEAD', 'SUPER_ADMIN')")
    @Operation(summary = "Get platform security & compliance audit trail")
    public ResponseEntity<ApiResponse<Page<AuditLogDto.AuditLogResponse>>> getLogs(
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @PageableDefault(size = 30) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(auditLogService.getLogs(action, entityType, pageable)));
    }
}
