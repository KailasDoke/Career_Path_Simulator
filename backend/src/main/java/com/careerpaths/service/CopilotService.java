package com.careerpaths.service;

import com.careerpaths.dto.CopilotRequestDto;
import com.careerpaths.dto.CopilotResponseDto;
import com.careerpaths.dto.pathway.PathwayDto;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CopilotService {

    private final PathwayEngineService pathwayEngineService;
    private final GeminiClient geminiClient;
    
    @org.springframework.beans.factory.annotation.Value("${gemini.api.key:}")
    private String geminiApiKey;

    public CopilotService(PathwayEngineService pathwayEngineService, GeminiClient geminiClient) {
        this.pathwayEngineService = pathwayEngineService;
        this.geminiClient = geminiClient;
    }

    public CopilotResponseDto ask(CopilotRequestDto request) {
        String q = request.getQuestion().toLowerCase();
        
        // 1. Construct Grounded Context
        List<PathwayDto> pathways = pathwayEngineService.generatePathways(request.getStudentId());

        if (geminiApiKey != null && !geminiApiKey.isEmpty() && !geminiApiKey.equals("YOUR_API_KEY_HERE")) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                String contextStr = mapper.writeValueAsString(pathways);
                return geminiClient.askGemini(contextStr, request.getQuestion());
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // 2. Intent Detection & Response Generation (Mock RAG)
        if (q.contains("why did you show me this pathway") || q.contains("difference")) {
            return CopilotResponseDto.builder()
                .answer("Pathways are generated based on different optimization goals: Academic Fit, Financial Fit, and Interest Fit.")
                .why("Our engine evaluates your aptitude scores, location preferences, and maximum budget against known programs.")
                .evidence("You currently have " + pathways.size() + " recommended pathways in the structured database.")
                .assumptions("Assumes your provided scores and budget reflect your current situation accurately.")
                .uncertainty("Actual program availability may vary based on future admission cycles.")
                .nextStep("Try simulating a budget change or updating your academic scores to see how these pathways shift.")
                .build();
        } 
        else if (q.contains("scholarship") || q.contains("sholarship")) {
            return CopilotResponseDto.builder()
                .answer("You may qualify for university-specific merit scholarships and need-based federal aid based on your profile.")
                .why("Your academic records and financial profile define the baseline criteria for matching.")
                .evidence("The Finance Engine matches you against specific criteria like min GPA or max family income (Source: Knowledge Base DEMO data).")
                .assumptions("Assumes all documents can be provided and deadlines are met.")
                .uncertainty("Scholarships are highly competitive and never guaranteed.")
                .nextStep("Visit the Financing page to view exact matched scholarships.")
                .build();
        }
        else if (q.contains("borrow") || q.contains("loan") || q.contains("afford")) {
            double estimatedCost = pathways.isEmpty() ? 0 : pathways.get(0).getEstimatedTotalCost();
            return CopilotResponseDto.builder()
                .answer("If your family contribution and scholarships do not cover the full cost, you will need to borrow the difference.")
                .why("Education requires funding. The platform identifies the gap between your available budget and the estimated tuition cost.")
                .evidence("The primary pathway requires approximately $" + estimatedCost + " in tuition. Compare this with your stated budget in your profile.")
                .assumptions("Assumes simple interest during the moratorium period if a loan is taken.")
                .uncertainty("Interest rates and actual living costs can fluctuate over the duration of the program.")
                .nextStep("Use the Education Loan calculator on the Financing page to estimate your EMI.")
                .build();
        }
        else if (q.contains("admission")) {
            return CopilotResponseDto.builder()
                .answer("If you do not get admission to your preferred program, the system identifies alternative programs that match your next highest aptitude and interest scores.")
                .why("Having backup options ensures a continuous academic journey without dead-ends.")
                .evidence("The engine evaluates all institutions within your preferred region that offer your degree.")
                .assumptions("Assumes secondary options have later or rolling admission deadlines.")
                .uncertainty("Alternative programs may have different financial requirements.")
                .nextStep("Use the 'What If?' simulator and select 'Preferred Program Unavailable' to see your exact fallback options.")
                .build();
        }
        else if (q.contains("abroad") || q.contains("budget")) {
            return CopilotResponseDto.builder()
                .answer("Studying abroad depends heavily on your budget and willingness to take an education loan.")
                .why("International programs typically have higher tuition and living expenses for international students.")
                .evidence("Based on your location preference in the student profile.")
                .assumptions("Assumes currency exchange rates remain relatively stable.")
                .uncertainty("Visa approvals and exact international tuition fees are subject to government and institutional changes.")
                .nextStep("Update your Location Preference in the Profile Builder to simulate international options.")
                .build();
        }

        // Fallback for missing/unknown info
        return CopilotResponseDto.builder()
            .answer("I don't have enough verified information to answer that.")
            .why("My knowledge is strictly grounded in the structured application data and verified sources.")
            .evidence("No relevant records found in the database for your query.")
            .assumptions("None.")
            .uncertainty("High.")
            .nextStep("Please ask a question related to your pathways, budget, scholarships, or admission scenarios.")
            .build();
    }
}
