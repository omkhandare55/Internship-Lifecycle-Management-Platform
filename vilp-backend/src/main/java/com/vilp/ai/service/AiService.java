package com.vilp.ai.service;

import com.vilp.ai.dto.AiDto;
import com.vilp.exception.ResourceNotFoundException;
import com.vilp.internship.entity.Internship;
import com.vilp.internship.repository.InternshipRepository;
import com.vilp.student.entity.Skill;
import com.vilp.student.entity.Student;
import com.vilp.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * AI Gateway Service
 * Source: TRD §21, §22, §23, §24
 *
 * Advisory match scoring, resume evaluation, and deterministic skill-gap roadmaps.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AiService {

    private final StudentRepository studentRepository;
    private final InternshipRepository internshipRepository;

    @Autowired(required = false)
    private GroqAiClient groqClient;

    @Autowired(required = false)
    private GeminiAiClient geminiClient;

    public List<AiDto.InternshipRecommendation> getRecommendations(UUID studentUserId) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        List<Internship> openInternships = internshipRepository
                .findOpenInternships(PageRequest.of(0, 50))
                .getContent();

        Set<String> studentSkills = student.getSkills() != null
                ? student.getSkills().stream().map(s -> s.getName().toLowerCase()).collect(Collectors.toSet())
                : Collections.emptySet();

        List<AiDto.InternshipRecommendation> list = new ArrayList<>();

        for (Internship i : openInternships) {
            List<String> matched = new ArrayList<>();
            List<String> missing = new ArrayList<>();
            List<String> reasons = new ArrayList<>();

            Set<Skill> reqSkills = i.getRequiredSkills() != null ? i.getRequiredSkills() : Collections.emptySet();
            for (Skill s : reqSkills) {
                if (studentSkills.contains(s.getName().toLowerCase())) {
                    matched.add(s.getName());
                } else {
                    missing.add(s.getName());
                }
            }

            int skillScore = reqSkills.isEmpty() ? 80 : (int) Math.round(((double) matched.size() / reqSkills.size()) * 70);

            // CGPA factor
            int academicScore = 30;
            if (i.getRequirement() != null && i.getRequirement().getMinimumCgpa() != null) {
                BigDecimal minCgpa = i.getRequirement().getMinimumCgpa();
                BigDecimal stuCgpa = student.getCgpa() != null ? student.getCgpa() : BigDecimal.ZERO;
                if (stuCgpa.compareTo(minCgpa) >= 0) {
                    academicScore = 30;
                    reasons.add("CGPA of " + stuCgpa + " satisfies academic cutoff (" + minCgpa + ")");
                } else {
                    academicScore = 10;
                }
            }

            if (!matched.isEmpty()) {
                reasons.add("Strong skill match in " + String.join(", ", matched));
            }

            int totalScore = Math.min(skillScore + academicScore, 100);

            String advice = missing.isEmpty()
                    ? "Perfect profile match! Highly recommended to apply now."
                    : "To increase selection chances, review key topics in: " + String.join(", ", missing);

            list.add(AiDto.InternshipRecommendation.builder()
                    .internshipId(i.getId())
                    .uniqueId(i.getUniqueId())
                    .title(i.getTitle())
                    .companyName(i.getCompany() != null ? i.getCompany().getName() : "Accredited Recruiter")
                    .matchScore(totalScore)
                    .matchedSkills(matched)
                    .missingSkills(missing)
                    .matchReasons(reasons)
                    .learningPathAdvice(advice)
                    .build());
        }

        // Sort descending by score
        list.sort(Comparator.comparingInt(AiDto.InternshipRecommendation::getMatchScore).reversed());
        return list;
    }

    public AiDto.ResumeScoreResponse evaluateResume(UUID studentUserId) {
        // Try real AI first (Groq AI primary, Gemini secondary)
        if (groqClient != null || geminiClient != null) {
            try {
                Student student = studentRepository.findByUserId(studentUserId)
                        .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));
                List<String> skillNames = student.getSkills() != null
                        ? student.getSkills().stream().map(Skill::getName).collect(Collectors.toList())
                        : Collections.emptyList();

                String aiResult = null;
                if (groqClient != null) {
                    aiResult = groqClient.analyzeResume(
                            student.getFullName(),
                            student.getAbout(),
                            skillNames,
                            student.getCgpa() != null ? student.getCgpa().toString() : null,
                            student.getProfileCompletion() != null ? student.getProfileCompletion() : 0);
                }
                if (aiResult == null && geminiClient != null) {
                    aiResult = geminiClient.analyzeResume(
                            student.getFullName(),
                            student.getAbout(),
                            skillNames,
                            student.getCgpa() != null ? student.getCgpa().toString() : null,
                            student.getProfileCompletion() != null ? student.getProfileCompletion() : 0);
                }

                if (aiResult != null) {
                    AiDto.ResumeScoreResponse parsed = parseGeminiResumeResponse(aiResult);
                    if (parsed != null) return parsed;
                }
            } catch (Exception e) {
                log.debug("AI resume analysis failed, falling back to rule-based: {}", e.getMessage());
            }
        }

        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        int skillsCount = student.getSkills() != null ? student.getSkills().size() : 0;
        int completion = student.getProfileCompletion() != null ? student.getProfileCompletion() : 0;

        int techFit = Math.min(skillsCount * 12 + (student.getCgpa() != null ? 20 : 0), 100);
        int formatting = 90;
        int completeness = completion;

        int overall = (int) Math.round((techFit * 0.45) + (formatting * 0.25) + (completeness * 0.30));

        List<String> strengths = new ArrayList<>();
        List<String> improvements = new ArrayList<>();
        List<String> keywords = List.of("REST API", "Microservices", "PostgreSQL", "Docker", "Git Workflow", "Unit Testing", "CI/CD", "TanStack Query");

        if (student.getCgpa() != null && student.getCgpa().doubleValue() >= 8.0) {
            strengths.add("High academic distinction (CGPA >= 8.0)");
        }
        if (student.getBacklogs() != null && student.getBacklogs() == 0) {
            strengths.add("Clean academic standing with 0 active backlogs");
        }
        if (skillsCount >= 5) {
            strengths.add("Diversified technical skill stack (" + skillsCount + " certified skills)");
        }

        if (skillsCount < 3) {
            improvements.add("Add at least 4-5 accredited core skills from catalog");
        }
        if (student.getPortfolioUrl() == null || student.getPortfolioUrl().isBlank()) {
            improvements.add("Include a portfolio / GitHub link demonstrating project code");
        }
        if (student.getAbout() == null || student.getAbout().length() < 50) {
            improvements.add("Expand professional summary to highlight technical interests");
        }

        return AiDto.ResumeScoreResponse.builder()
                .overallScore(overall)
                .technicalFitScore(techFit)
                .formattingScore(formatting)
                .completenessScore(completeness)
                .strengths(strengths)
                .improvementAreas(improvements)
                .recommendedKeywords(keywords)
                .build();
    }

    public AiDto.SkillGapResponse analyzeSkillGap(UUID studentUserId, UUID internshipId) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found"));

        Set<String> studentSkills = student.getSkills() != null
                ? student.getSkills().stream().map(s -> s.getName().toLowerCase()).collect(Collectors.toSet())
                : Collections.emptySet();

        Set<Skill> reqSkills = internship.getRequiredSkills() != null ? internship.getRequiredSkills() : Collections.emptySet();

        List<String> matched = new ArrayList<>();
        List<String> missing = new ArrayList<>();
        List<AiDto.LearningRecommendation> roadmap = new ArrayList<>();

        for (Skill req : reqSkills) {
            if (studentSkills.contains(req.getName().toLowerCase())) {
                matched.add(req.getName());
            } else {
                missing.add(req.getName());
                roadmap.add(AiDto.LearningRecommendation.builder()
                        .skillName(req.getName())
                        .suggestedTopics("Fundamentals, Best Practices, and Hands-on REST integration")
                        .estimatedTimeToLearn("2-3 weeks (15-20 hours)")
                        .recommendedProjectType("Build an end-to-end fullstack project demonstrating " + req.getName())
                        .build());
            }
        }

        int total = reqSkills.size();
        int matchedCount = matched.size();
        int gapCount = missing.size();
        int matchPct = total > 0 ? (int) Math.round(((double) matchedCount / total) * 100) : 100;

        return AiDto.SkillGapResponse.builder()
                .internshipId(internshipId)
                .totalRequiredSkills(total)
                .matchedCount(matchedCount)
                .gapCount(gapCount)
                .matchPercentage(matchPct)
                .matchedSkills(matched)
                .missingSkills(missing)
                .learningRoadmap(roadmap)
                .build();
    }

    private AiDto.ResumeScoreResponse parseGeminiResumeResponse(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode node = mapper.readTree(json);
            return AiDto.ResumeScoreResponse.builder()
                    .overallScore(node.path("overallScore").asInt(70))
                    .technicalFitScore(node.path("technicalFitScore").asInt(70))
                    .formattingScore(90) // Gemini doesn't assess formatting
                    .completenessScore(node.path("completenessScore").asInt(70))
                    .strengths(parseStringList(node.path("strengths")))
                    .improvementAreas(parseStringList(node.path("improvementAreas")))
                    .recommendedKeywords(parseStringList(node.path("recommendedKeywords")))
                    .build();
        } catch (Exception e) {
            log.debug("Failed to parse Gemini resume response: {}", e.getMessage());
            return null;
        }
    }

    private List<String> parseStringList(JsonNode arrayNode) {
        List<String> result = new ArrayList<>();
        if (arrayNode.isArray()) {
            for (JsonNode item : arrayNode) {
                result.add(item.asText());
            }
        }
        return result;
    }
}
