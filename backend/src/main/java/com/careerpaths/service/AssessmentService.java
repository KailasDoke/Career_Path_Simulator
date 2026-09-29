package com.careerpaths.service;

import com.careerpaths.dto.assessment.*;
import com.careerpaths.entity.*;
import com.careerpaths.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

    private final StudentProfileRepository profileRepository;

    private static final List<QuestionDef> APTITUDE_QUESTIONS = Arrays.asList(
        new QuestionDef("A1", "What comes next in the sequence: 2, 6, 12, 20, 30, ...?", Arrays.asList("40", "42", "44", "48"), "42", "NUMERICAL", "Medium"),
        new QuestionDef("A2", "If all bloops are blips, and some blips are blaps, are all bloops blaps?", Arrays.asList("Yes", "No", "Cannot be determined"), "Cannot be determined", "LOGICAL", "Hard"),
        new QuestionDef("A3", "Which word does not belong?", Arrays.asList("Apple", "Banana", "Carrot", "Orange"), "Carrot", "VERBAL", "Easy"),
        new QuestionDef("A4", "A bat and ball cost $1.10. The bat costs $1.00 more than the ball. How much is the ball?", Arrays.asList("10 cents", "5 cents", "1 cent", "None"), "5 cents", "PROBLEM_SOLVING", "Medium"),
        new QuestionDef("A5", "Imagine folding a net of a cube. Which sides are opposite?", Arrays.asList("A and C", "B and D", "A and D", "Depends"), "A and C", "SPATIAL", "Hard"),
        new QuestionDef("A6", "Solve: 15 * 12", Arrays.asList("180", "160", "150", "190"), "180", "NUMERICAL", "Easy"),
        new QuestionDef("A7", "If A is taller than B, and B is taller than C, who is shortest?", Arrays.asList("A", "B", "C"), "C", "LOGICAL", "Easy"),
        new QuestionDef("A8", "Synonym for 'enormous'?", Arrays.asList("Tiny", "Large", "Gigantic", "Average"), "Gigantic", "VERBAL", "Easy"),
        new QuestionDef("A9", "You have a 3L and 5L jug. Can you measure exactly 4L?", Arrays.asList("Yes", "No"), "Yes", "PROBLEM_SOLVING", "Hard"),
        new QuestionDef("A10", "Which shape completes the pattern?", Arrays.asList("Circle", "Square", "Triangle", "Star"), "Triangle", "SPATIAL", "Medium")
    );

    private static final List<QuestionDef> INTEREST_QUESTIONS = Arrays.asList(
        new QuestionDef("I1", "I enjoy writing code and building software.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "TECHNOLOGY", "None"),
        new QuestionDef("I2", "I love understanding how machines work.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "ENGINEERING", "None"),
        new QuestionDef("I3", "I want to help heal people and study biology.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "HEALTHCARE", "None"),
        new QuestionDef("I4", "I am fascinated by stock markets and economics.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "FINANCE", "None"),
        new QuestionDef("I5", "I enjoy sketching, painting, and visual arts.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "DESIGN", "None"),
        new QuestionDef("I6", "I am interested in running my own business.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "BUSINESS", "None"),
        new QuestionDef("I7", "I like to analyze data and discover new facts.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "RESEARCH", "None"),
        new QuestionDef("I8", "I love performing or creating artistic pieces.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "ARTS", "None"),
        new QuestionDef("I9", "I enjoy studying human behavior and society.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "SOCIAL_SCIENCES", "None"),
        new QuestionDef("I10", "I am passionate about protecting nature.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "ENVIRONMENT", "None")
    );

    private static class QuestionDef {
        String id; String question; List<String> options; String answer; String category; String difficulty;
        QuestionDef(String id, String question, List<String> options, String answer, String category, String difficulty) {
            this.id = id; this.question = question; this.options = options; this.answer = answer; this.category = category; this.difficulty = difficulty;
        }
    }

    public AssessmentService(StudentProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public List<AssessmentQuestionDto> getQuestions() {
        List<AssessmentQuestionDto> dtoList = new ArrayList<>();
        
        APTITUDE_QUESTIONS.forEach(q -> 
            dtoList.add(new AssessmentQuestionDto(q.id, q.question, q.options, q.category, "APTITUDE", q.difficulty))
        );
        INTEREST_QUESTIONS.forEach(q -> 
            dtoList.add(new AssessmentQuestionDto(q.id, q.question, q.options, q.category, "INTEREST", q.difficulty))
        );
        
        return dtoList;
    }

    @Transactional
    public AssessmentResultDto submitAssessment(Long studentId, AssessmentSubmissionDto submission) {
        Map<String, Integer> aptitudeScores = new HashMap<>();
        Map<String, Integer> interestScores = new HashMap<>();
        
        // Calculate Aptitude
        Map<String, Integer> aptMax = new HashMap<>();
        for (QuestionDef q : APTITUDE_QUESTIONS) {
            aptMax.put(q.category, aptMax.getOrDefault(q.category, 0) + 1);
            if (q.answer.equals(submission.getAnswers().get(q.id))) {
                aptitudeScores.put(q.category, aptitudeScores.getOrDefault(q.category, 0) + 1);
            }
        }
        
        // Normalize Aptitude to 100
        aptMax.forEach((cat, max) -> {
            int score = aptitudeScores.getOrDefault(cat, 0);
            aptitudeScores.put(cat, (int) Math.round(((double) score / max) * 100));
        });

        // Ensure all aptitude categories are present even if 0
        Arrays.asList("NUMERICAL", "LOGICAL", "VERBAL", "PROBLEM_SOLVING", "SPATIAL").forEach(cat -> {
            aptitudeScores.putIfAbsent(cat, 0);
        });

        // Calculate Interests (Likert scale 1-5 to 0-100)
        for (QuestionDef q : INTEREST_QUESTIONS) {
            String ans = submission.getAnswers().get(q.id);
            int score = 50; // Neutral default
            if ("Strongly Disagree".equals(ans)) score = 0;
            if ("Disagree".equals(ans)) score = 25;
            if ("Agree".equals(ans)) score = 75;
            if ("Strongly Agree".equals(ans)) score = 100;
            
            interestScores.put(q.category, score);
        }

        // Persist to StudentProfile (Assuming user is fetched)
        StudentProfile profile = profileRepository.findById(studentId).orElse(null);
        if (profile != null) {
            AptitudeResult result = profile.getAptitudeResult();
            if (result == null) {
                result = AptitudeResult.builder().studentProfile(profile).build();
                profile.setAptitudeResult(result);
            }
            result.setLogicalReasoningScore(aptitudeScores.getOrDefault("LOGICAL", 0));
            result.setNumericalReasoningScore(aptitudeScores.getOrDefault("NUMERICAL", 0));
            result.setVerbalReasoningScore(aptitudeScores.getOrDefault("VERBAL", 0));
            result.setProblemSolvingScore(aptitudeScores.getOrDefault("PROBLEM_SOLVING", 0));
            result.setSpatialReasoningScore(aptitudeScores.getOrDefault("SPATIAL", 0));

            InterestProfile iProfile = profile.getInterestProfile();
            if (iProfile == null) {
                iProfile = InterestProfile.builder().studentProfile(profile).build();
                profile.setInterestProfile(iProfile);
            }
            iProfile.setTechnologyScore(interestScores.getOrDefault("TECHNOLOGY", 0));
            iProfile.setEngineeringScore(interestScores.getOrDefault("ENGINEERING", 0));
            iProfile.setHealthcareScore(interestScores.getOrDefault("HEALTHCARE", 0));
            iProfile.setBusinessScore(interestScores.getOrDefault("BUSINESS", 0));
            iProfile.setFinanceScore(interestScores.getOrDefault("FINANCE", 0));
            iProfile.setDesignScore(interestScores.getOrDefault("DESIGN", 0));
            iProfile.setResearchScore(interestScores.getOrDefault("RESEARCH", 0));
            iProfile.setArtsScore(interestScores.getOrDefault("ARTS", 0));
            iProfile.setSocialSciencesScore(interestScores.getOrDefault("SOCIAL_SCIENCES", 0));
            iProfile.setEnvironmentScore(interestScores.getOrDefault("ENVIRONMENT", 0));
            
            profileRepository.save(profile);
        }

        AssessmentResultDto resultDto = new AssessmentResultDto();
        resultDto.setAptitudeScores(aptitudeScores);
        resultDto.setInterestScores(interestScores);
        
        // Structured Profile Preparation
        StructuredProfileDto sp = new StructuredProfileDto();
        
        // Mock structured extraction
        List<String> aptStrengths = aptitudeScores.entrySet().stream()
            .filter(e -> e.getValue() > 70)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
            
        List<String> intStrengths = interestScores.entrySet().stream()
            .filter(e -> e.getValue() > 60)
            .map(Map.Entry::getKey)
            .collect(Collectors.toList());
            
        sp.setAptitudeStrengths(aptStrengths);
        sp.setInterests(intStrengths);
        sp.setAcademicStrengths(new ArrayList<>());
        sp.setFinancialConstraints(new ArrayList<>());
        sp.setLocationPreferences(new ArrayList<>());
        
        resultDto.setStructuredProfile(sp);

        return resultDto;
    }
}
