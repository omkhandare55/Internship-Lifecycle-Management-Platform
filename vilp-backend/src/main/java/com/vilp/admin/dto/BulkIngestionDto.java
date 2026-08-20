package com.vilp.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

public class BulkIngestionDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentRow {
        private String studentNumber;
        private String fullName;
        private String email;
        private String departmentCode; // e.g. CSE, IT, ECE
        private String branch;
        private Integer semester;
        private BigDecimal cgpa;
        private Integer backlogs;
        private Integer passingYear;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IngestionReport {
        private int totalProcessed;
        private int totalImported;
        private int totalSkipped;
        private List<String> skippedReasons;
        private List<String> importedStudentNumbers;
    }
}
