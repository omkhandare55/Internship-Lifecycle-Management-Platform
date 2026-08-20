package com.vilp.logbook.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public class WeeklyReportDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WeeklyReportResponse {
        private UUID id;
        private UUID studentId;
        private String studentName;
        private String studentNumber;
        private UUID internshipId;
        private String internshipTitle;
        private Integer weekNumber;
        private LocalDate startDate;
        private LocalDate endDate;
        private Integer hoursWorked;
        private String tasksSummary;
        private String skillsApplied;
        private String challengesFaced;
        private String learnings;
        private String status;
        private String mentorFeedback;
        private Integer rating;
        private UUID reviewerId;
        private OffsetDateTime reviewedAt;
        private OffsetDateTime createdAt;
    }

    @Data
    public static class SubmitReportRequest {
        private UUID internshipId;
        private Integer weekNumber;
        private LocalDate startDate;
        private LocalDate endDate;
        private Integer hoursWorked;
        private String tasksSummary;
        private String skillsApplied;
        private String challengesFaced;
        private String learnings;
    }

    @Data
    public static class ReviewReportRequest {
        private String status; // APPROVED | REVISIONS_REQUESTED | REJECTED
        private String feedback;
        private Integer rating; // 1 - 5
    }

    public static WeeklyReportResponse toResponse(com.vilp.logbook.entity.WeeklyReport r) {
        var s = r.getStudent();
        var i = r.getInternship();
        return WeeklyReportResponse.builder()
                .id(r.getId())
                .studentId(s != null ? s.getId() : null)
                .studentName(s != null ? s.getFullName() : null)
                .studentNumber(s != null ? s.getStudentNumber() : null)
                .internshipId(i != null ? i.getId() : null)
                .internshipTitle(i != null ? i.getTitle() : null)
                .weekNumber(r.getWeekNumber())
                .startDate(r.getStartDate())
                .endDate(r.getEndDate())
                .hoursWorked(r.getHoursWorked())
                .tasksSummary(r.getTasksSummary())
                .skillsApplied(r.getSkillsApplied())
                .challengesFaced(r.getChallengesFaced())
                .learnings(r.getLearnings())
                .status(r.getStatus())
                .mentorFeedback(r.getMentorFeedback())
                .rating(r.getRating())
                .reviewerId(r.getReviewer() != null ? r.getReviewer().getId() : null)
                .reviewedAt(r.getReviewedAt())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
