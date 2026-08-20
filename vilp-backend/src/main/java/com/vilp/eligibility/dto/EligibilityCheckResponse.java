package com.vilp.eligibility.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EligibilityCheckResponse {

    private UUID internshipId;
    private UUID studentId;
    private boolean eligible;
    private int score; // 0 - 100
    
    @Builder.Default
    private List<RuleEvaluation> evaluations = new ArrayList<>();
    
    @Builder.Default
    private List<String> matchedSkills = new ArrayList<>();
    
    @Builder.Default
    private List<String> missingSkills = new ArrayList<>();

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RuleEvaluation {
        private String rule; // ACCOUNT_VERIFIED | PROFILE_COMPLETION | MIN_CGPA | MAX_BACKLOGS | DEPARTMENT | BRANCH | PASSING_YEAR | REQUIRED_SKILLS
        private boolean passed;
        private String message;
    }
}
