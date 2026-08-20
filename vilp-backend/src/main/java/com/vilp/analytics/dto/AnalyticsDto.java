package com.vilp.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

public class AnalyticsDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InstitutionalOverview {
        private long totalStudents;
        private long verifiedStudents;
        private long totalCompanies;
        private long verifiedCompanies;
        private long totalInternships;
        private long totalApplications;
        private long totalOffers;
        private long totalCompletedCertificates;
        private long totalPpos;
        private double averageCtcLpa; // in Lakhs Per Annum (e.g. 8.5)
        private double ppoConversionRate; // percentage (e.g. 24.5%)
        private List<DepartmentMetric> departmentMetrics;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentMetric {
        private String departmentName;
        private String departmentCode;
        private long studentCount;
        private long activeInternshipsCount;
        private long ppoCount;
    }
}
