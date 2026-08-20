package com.vilp.admin.controller;

import com.vilp.admin.dto.BulkIngestionDto;
import com.vilp.admin.service.BulkStudentIngestionService;
import com.vilp.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bulk")
@RequiredArgsConstructor
@Tag(name = "Admin Bulk Ingestion", description = "University batch onboarding endpoints")
public class BulkIngestionController {

    private final BulkStudentIngestionService bulkStudentIngestionService;

    @PostMapping("/students")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'TNP_OFFICER', 'TNP_HEAD')")
    @Operation(summary = "Batch import university student rosters")
    public ResponseEntity<ApiResponse<BulkIngestionDto.IngestionReport>> bulkImportStudents(
            @RequestBody List<BulkIngestionDto.StudentRow> rows
    ) {
        BulkIngestionDto.IngestionReport report = bulkStudentIngestionService.ingestStudents(rows);
        return ResponseEntity.ok(ApiResponse.success("Bulk student ingestion completed", report));
    }
}
