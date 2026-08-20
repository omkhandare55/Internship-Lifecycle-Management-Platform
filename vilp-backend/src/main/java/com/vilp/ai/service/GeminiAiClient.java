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
 * Gemini AI client for real resume analysis and skill gap assessment.
 * Only activated when GEMINI_API_KEY environment variable is set.
 *
 * Uses Google's Gemini Flash model for fast, cost-effective inference.
 * Falls back gracefully — if this bean is absent, AiService uses rule-based scoring.
 */
@Service
@ConditionalOnProperty(name = "app.gemini.api-key", matchIfMissing = false)
@Slf4j
public class GeminiAiClient {

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.model:gemini-2.0-flash}")
    private String model;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String GEMINI_BASE_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/";

    /**
     * Analyze a student's profile and return structured resume scoring.
     * Returns raw JSON string from Gemini — caller must parse.
     * Returns null on any failure (caller falls back to rule-based scoring).
     */
    public String analyzeResume(String studentName, String about, List<String> skills,
                                 String cgpa, int profileCompletion) {
        String prompt = """
                You are an expert career advisor for engineering students in India.
                Analyze this student profile and respond in STRICT JSON format only (no markdown, no explanation):

                Student Name: %s
                About: %s
                Skills: %s
                CGPA: %s
                Profile Completion: %d%%

                Respond with this exact JSON structure:
                {
                  "overallScore": <0-100 integer>,
                  "technicalFitScore": <0-100>,
                  "completenessScore": <0-100>,
                  "strengths": ["strength1", "strength2", "strength3"],
                  "improvementAreas": ["area1", "area2", "area3"],
                  "recommendedKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
                }
                """.formatted(studentName, about != null ? about : "Not provided",
                String.join(", ", skills), cgpa != null ? cgpa : "N/A", profileCompletion);

        return callGemini(prompt);
    }

    /**
     * Generate personalized skill gap analysis for a student vs internship requirements.
     * Returns raw JSON string or null on failure.
     */
    public String analyzeSkillGap(String studentName, List<String> studentSkills,
                                   String internshipTitle, List<String> requiredSkills) {
        String prompt = """
                You are a technical career advisor. Analyze the skill gap between a student and an internship.
                Respond in STRICT JSON format only:

                Student: %s
                Student Skills: %s
                Internship: %s
                Required Skills: %s

                Respond with this exact JSON structure:
                {
                  "matchPercentage": <0-100>,
                  "matchedSkills": ["skill1", "skill2"],
                  "missingSkills": ["skill1", "skill2"],
                  "learningRoadmap": [
                    {
                      "skillName": "skill",
                      "suggestedTopics": "topic description",
                      "estimatedTimeToLearn": "X weeks (Y hours)",
                      "recommendedProjectType": "project description"
                    }
                  ]
                }
                """.formatted(studentName, String.join(", ", studentSkills),
                internshipTitle, String.join(", ", requiredSkills));

        return callGemini(prompt);
    }

    /**
     * Call the Gemini generateContent API.
     * Returns the text content from the first candidate, or null on failure.
     */
    private String callGemini(String prompt) {
        try {
            String url = GEMINI_BASE_URL + model + ":generateContent?key=" + apiKey;

            Map<String, Object> requestBody = Map.of(
                    "contents", List.of(Map.of(
                            "parts", List.of(Map.of("text", prompt))
                    )),
                    "generationConfig", Map.of(
                            "temperature", 0.2,
                            "maxOutputTokens", 1024,
                            "responseMimeType", "application/json"
                    )
            );

            String json = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .timeout(Duration.ofSeconds(30))
                    .build();

            HttpResponse<String> response = httpClient.send(request,
                    HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                log.warn("Gemini API returned status {}: {}", response.statusCode(),
                        response.body().substring(0, Math.min(200, response.body().length())));
                return null;
            }

            // Parse: candidates[0].content.parts[0].text
            JsonNode root = objectMapper.readTree(response.body());
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                String text = candidates.get(0).path("content").path("parts")
                        .get(0).path("text").asText();
                log.debug("Gemini response received ({} chars)", text.length());
                return text;
            }

            log.warn("Gemini response had no candidates");
            return null;

        } catch (Exception e) {
            log.warn("Gemini API call failed: {}", e.getMessage());
            return null;
        }
    }
}
