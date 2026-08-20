package com.vilp.ai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class AiDto {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InternshipRecommendation {
        private UUID internshipId;
        private String uniqueId;
        private String title;
        private String companyName;
        private int matchScore; // 0 - 100
        private List<String> matchedSkills;
        private List<String> missingSkills;
        private List<String> matchReasons;
        private String learningPathAdvice;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ResumeScoreResponse {
        private int overallScore; // 0 - 100
        private int technicalFitScore;
        private int formattingScore;
        private int completenessScore;
        private List<String> strengths;
        private List<String> improvementAreas;
        private List<String> recommendedKeywords;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillGapResponse {
        private UUID internshipId;
        private int totalRequiredSkills;
        private int matchedCount;
        private int gapCount;
        private int matchPercentage;
        private List<String> matchedSkills;
        private List<String> missingSkills;
        private List<LearningRecommendation> learningRoadmap;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LearningRecommendation {
        private String skillName;
        private String suggestedTopics;
        private String estimatedTimeToLearn; // e.g. "2-3 weeks"
        private String recommendedProjectType;
    }
}
