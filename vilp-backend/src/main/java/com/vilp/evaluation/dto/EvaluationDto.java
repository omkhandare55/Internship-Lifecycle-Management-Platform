package com.vilp.evaluation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.UUID;

public class EvaluationDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EvaluationResponse {
        private UUID id;
        private UUID internshipId;
        private String internshipTitle;
        private UUID studentId;
        private String studentName;
        private String studentNumber;
        private UUID evaluatorId;
        private String evaluatorType;
        private String evaluationType;
        private Integer technicalSkillsRating;
        private Integer communicationRating;
        private Integer punctualityRating;
        private Integer initiativeRating;
        private Integer overallPerformanceRating;
        private String remarks;
        private Boolean ppoRecommended;
        private String ppoTerms;
        private String status;
        private OffsetDateTime createdAt;
    }

    @Data
    public static class SubmitEvaluationRequest {
        private UUID internshipId;
        private UUID studentId;
        private String evaluatorType; // MENTOR | COMPANY
        private String evaluationType; // MIDTERM | FINAL
        private Integer technicalSkillsRating;
        private Integer communicationRating;
        private Integer punctualityRating;
        private Integer initiativeRating;
        private Integer overallPerformanceRating;
        private String remarks;
        private Boolean ppoRecommended;
        private String ppoTerms;
    }

    public static EvaluationResponse toResponse(com.vilp.evaluation.entity.Evaluation e) {
        var s = e.getStudent();
        var i = e.getInternship();
        return EvaluationResponse.builder()
                .id(e.getId())
                .internshipId(i != null ? i.getId() : null)
                .internshipTitle(i != null ? i.getTitle() : null)
                .studentId(s != null ? s.getId() : null)
                .studentName(s != null ? s.getFullName() : null)
                .studentNumber(s != null ? s.getStudentNumber() : null)
                .evaluatorId(e.getEvaluator() != null ? e.getEvaluator().getId() : null)
                .evaluatorType(e.getEvaluatorType())
                .evaluationType(e.getEvaluationType())
                .technicalSkillsRating(e.getTechnicalSkillsRating())
                .communicationRating(e.getCommunicationRating())
                .punctualityRating(e.getPunctualityRating())
                .initiativeRating(e.getInitiativeRating())
                .overallPerformanceRating(e.getOverallPerformanceRating())
                .remarks(e.getRemarks())
                .ppoRecommended(e.getPpoRecommended())
                .ppoTerms(e.getPpoTerms())
                .status(e.getStatus())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
