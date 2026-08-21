package com.vilp.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;

/**
 * Groq AI client for high-speed resume analysis and skill-gap evaluation.
 * Activated when GROQ_API_KEY environment variable is configured.
 * Uses Groq's ultra-low latency inference with Llama 3 models.
 */
@Service
@ConditionalOnProperty(name = "app.groq.api-key", matchIfMissing = false)
@Slf4j
public class GroqAiClient {

    @Value("${app.groq.api-key}")
    private String apiKey;

    @Value("${app.groq.model:llama-3.3-70b-versatile}")
    private String model;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

    /**
     * Analyze resume against engineering job placement criteria using Groq Llama 3.
     */
    public String analyzeResume(String studentName, String about, List<String> skills,
                                String cgpa, int profileCompletion) {
        String systemPrompt = "You are an expert technical career advisor for engineering students. You MUST respond in STRICT valid JSON only.";
        String userPrompt = """
                Analyze this student profile for software internship readiness:
                Student Name: %s
                About: %s
                Skills: %s
                CGPA: %s
                Profile Completion: %d%%

                Respond with this exact JSON format:
                {
                  "overallScore": 85,
                  "technicalFitScore": 88,
                  "completenessScore": 80,
                  "strengths": ["Strong foundational skills", "Good academic performance"],
                  "improvementAreas": ["Add GitHub portfolio projects", "Obtain cloud certifications"],
                  "recommendedKeywords": ["REST API", "Docker", "PostgreSQL", "Spring Boot", "Git Workflow"]
                }
                """.formatted(
                studentName != null ? studentName : "Candidate",
                about != null ? about : "Not provided",
                skills != null && !skills.isEmpty() ? String.join(", ", skills) : "General Engineering",
                cgpa != null ? cgpa : "N/A",
                profileCompletion
        );

        return callGroq(systemPrompt, userPrompt);
    }

    /**
     * Analyze skill gap between student and internship offering using Groq.
     */
    public String analyzeSkillGap(String studentName, List<String> studentSkills,
                                  String internshipTitle, List<String> requiredSkills) {
        String systemPrompt = "You are an automated career path planner. You MUST respond in STRICT valid JSON only.";
        String userPrompt = """
                Compare student skills against internship requirements and build a learning roadmap:
                Student: %s
                Student Skills: %s
                Internship: %s
                Required Skills: %s

                Respond with this exact JSON format:
                {
                  "matchPercentage": 75,
                  "matchedSkills": ["skill1", "skill2"],
                  "missingSkills": ["skill3"],
                  "learningRoadmap": [
                    {
                      "skillName": "skill3",
                      "suggestedTopics": "Core concepts and hands-on implementation",
                      "estimatedTimeToLearn": "2 weeks (10 hours)",
                      "recommendedProjectType": "Build a mini project demonstrating skill3"
                    }
                  ]
                }
                """.formatted(
                studentName != null ? studentName : "Candidate",
                studentSkills != null ? String.join(", ", studentSkills) : "None",
                internshipTitle,
                requiredSkills != null ? String.join(", ", requiredSkills) : "General"
        );

        return callGroq(systemPrompt, userPrompt);
    }

    private String callGroq(String systemPrompt, String userPrompt) {
        try {
            Map<String, Object> payload = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", userPrompt)
                    ),
                    "response_format", Map.of("type", "json_object"),
                    "temperature", 0.2,
                    "max_tokens", 1024
            );

            String jsonPayload = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(GROQ_API_URL))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(20))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("Groq API returned status {}: {}", response.statusCode(), response.body());
                return null;
            }

            JsonNode root = objectMapper.readTree(response.body());
            JsonNode choices = root.path("choices");
            if (choices.isArray() && !choices.isEmpty()) {
                String content = choices.get(0).path("message").path("content").asText();
                log.debug("Groq AI response received successfully ({} chars)", content.length());
                return content;
            }

            return null;
        } catch (Exception e) {
            log.warn("Groq AI API call failed: {}", e.getMessage());
            return null;
        }
    }
}
