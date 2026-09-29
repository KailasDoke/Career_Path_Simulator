package com.careerpaths.service;

import com.careerpaths.dto.CopilotResponseDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class GeminiClient {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public GeminiClient() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public CopilotResponseDto askGemini(String promptContext, String userQuestion) {
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_API_KEY_HERE")) {
            throw new IllegalStateException("Gemini API key is not configured.");
        }

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=" + apiKey;

        String systemInstruction = "You are an AI Career Copilot. You help students understand their generated career pathways, budget, and scholarships. " +
                "You must strictly base your answer ONLY on the provided Context Data. Do not invent any new facts, universities, or loans. " +
                "You must respond ONLY with a valid JSON object matching this schema exactly:\n" +
                "{\n" +
                "  \"answer\": \"Direct response to the question\",\n" +
                "  \"why\": \"The reasoning based on the context data\",\n" +
                "  \"evidence\": \"Source citations from the context data\",\n" +
                "  \"assumptions\": \"Any assumptions you had to make\",\n" +
                "  \"uncertainty\": \"What is uncertain about this?\",\n" +
                "  \"nextStep\": \"A suggested next step\"\n" +
                "}\n" +
                "Do not include markdown formatting or backticks around the JSON. Just return the raw JSON object.";

        String fullPrompt = "System Instructions:\n" + systemInstruction + "\n\n" +
                            "Context Data:\n" + promptContext + "\n\n" +
                            "User Question:\n" + userQuestion;

        Map<String, Object> requestBody = new HashMap<>();
        
        Map<String, Object> parts = new HashMap<>();
        parts.put("text", fullPrompt);
        
        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(parts));
        
        requestBody.put("contents", List.of(content));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            String responseStr = restTemplate.postForObject(url, entity, String.class);
            JsonNode rootNode = objectMapper.readTree(responseStr);
            JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");
            
            String jsonOutput = textNode.asText().trim();
            // Clean up possible markdown backticks
            if (jsonOutput.startsWith("```json")) {
                jsonOutput = jsonOutput.substring(7);
            } else if (jsonOutput.startsWith("```")) {
                jsonOutput = jsonOutput.substring(3);
            }
            if (jsonOutput.endsWith("```")) {
                jsonOutput = jsonOutput.substring(0, jsonOutput.length() - 3);
            }
            
            return objectMapper.readValue(jsonOutput.trim(), CopilotResponseDto.class);
            
        } catch (Exception e) {
            e.printStackTrace();
            return CopilotResponseDto.builder()
                .answer("I encountered an error connecting to the AI.")
                .why("The Gemini API request failed.")
                .evidence(e.getMessage())
                .assumptions("None")
                .uncertainty("High")
                .nextStep("Check the backend console logs and ensure your API key is valid.")
                .build();
        }
    }
}
