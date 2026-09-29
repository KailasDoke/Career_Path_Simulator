$baseDir = "C:\Users\kaila\Downloads\Career\career-path-simulator\backend\src\main\java\com\careerpaths"

New-Item -ItemType Directory -Force -Path "$baseDir\dto\assessment"

$dtoCode = @"
package com.careerpaths.dto.assessment;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class AssessmentQuestionDto {
    private String id;
    private String question;
    private List<String> options;
    private String category;
    private String type; // 'APTITUDE' or 'INTEREST'
}

@Data
class AssessmentSubmissionDto {
    private Map<String, String> answers; // Question ID -> Selected Option
}

@Data
class AssessmentResultDto {
    private Map<String, Integer> aptitudeScores; // Category -> Score (0-100)
    private Map<String, Integer> interestScores; // Domain -> Score (0-100)
    private StructuredProfileDto structuredProfile;
}

@Data
class StructuredProfileDto {
    private List<String> academicStrengths;
    private List<String> aptitudeStrengths;
    private List<String> interests;
    private List<String> financialConstraints;
    private List<String> locationPreferences;
}
"@

Set-Content -Path "$baseDir\dto\assessment\AssessmentDto.java" -Value $dtoCode

# We will separate the DTOs into separate files to avoid access issues later.
$qCode = @"
package com.careerpaths.dto.assessment;
import lombok.Data;
import java.util.List;
@Data
public class AssessmentQuestionDto {
    private String id;
    private String question;
    private List<String> options;
    private String category;
    private String type; // 'APTITUDE' or 'INTEREST'
    
    public AssessmentQuestionDto() {}
    
    public AssessmentQuestionDto(String id, String question, List<String> options, String category, String type) {
        this.id = id;
        this.question = question;
        this.options = options;
        this.category = category;
        this.type = type;
    }
}
"@
Set-Content -Path "$baseDir\dto\assessment\AssessmentQuestionDto.java" -Value $qCode

$sCode = @"
package com.careerpaths.dto.assessment;
import lombok.Data;
import java.util.Map;
@Data
public class AssessmentSubmissionDto {
    private Map<String, String> answers;
}
"@
Set-Content -Path "$baseDir\dto\assessment\AssessmentSubmissionDto.java" -Value $sCode

$rCode = @"
package com.careerpaths.dto.assessment;
import lombok.Data;
import java.util.Map;
@Data
public class AssessmentResultDto {
    private Map<String, Integer> aptitudeScores;
    private Map<String, Integer> interestScores;
    private StructuredProfileDto structuredProfile;
}
"@
Set-Content -Path "$baseDir\dto\assessment\AssessmentResultDto.java" -Value $rCode

$spCode = @"
package com.careerpaths.dto.assessment;
import lombok.Data;
import java.util.List;
@Data
public class StructuredProfileDto {
    private List<String> academicStrengths;
    private List<String> aptitudeStrengths;
    private List<String> interests;
    private List<String> financialConstraints;
    private List<String> locationPreferences;
}
"@
Set-Content -Path "$baseDir\dto\assessment\StructuredProfileDto.java" -Value $spCode

$serviceCode = @"
package com.careerpaths.service;

import com.careerpaths.dto.assessment.*;
import com.careerpaths.entity.*;
import com.careerpaths.repository.StudentProfileRepository;
import com.careerpaths.repository.AptitudeResultRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssessmentService {

    private final StudentProfileRepository profileRepository;

    private static final List<QuestionDef> APTITUDE_QUESTIONS = Arrays.asList(
        new QuestionDef("A1", "What comes next in the sequence: 2, 6, 12, 20, 30, ...?", Arrays.asList("40", "42", "44", "48"), "42", "NUMERICAL"),
        new QuestionDef("A2", "If all bloops are blips, and some blips are blaps, are all bloops blaps?", Arrays.asList("Yes", "No", "Cannot be determined"), "Cannot be determined", "LOGICAL"),
        new QuestionDef("A3", "Which word does not belong?", Arrays.asList("Apple", "Banana", "Carrot", "Orange"), "Carrot", "VERBAL"),
        new QuestionDef("A4", "A bat and ball cost $1.10. The bat costs $1.00 more than the ball. How much is the ball?", Arrays.asList("10 cents", "5 cents", "1 cent", "None"), "5 cents", "PROBLEM_SOLVING"),
        new QuestionDef("A5", "Imagine folding a net of a cube. Which sides are opposite?", Arrays.asList("A and C", "B and D", "A and D", "Depends"), "A and C", "SPATIAL"),
        // Added extra to have a baseline
        new QuestionDef("A6", "Solve: 15 * 12", Arrays.asList("180", "160", "150", "190"), "180", "NUMERICAL"),
        new QuestionDef("A7", "If A is taller than B, and B is taller than C, who is shortest?", Arrays.asList("A", "B", "C"), "C", "LOGICAL"),
        new QuestionDef("A8", "Synonym for 'enormous'?", Arrays.asList("Tiny", "Large", "Gigantic", "Average"), "Gigantic", "VERBAL"),
        new QuestionDef("A9", "You have a 3L and 5L jug. Can you measure exactly 4L?", Arrays.asList("Yes", "No"), "Yes", "PROBLEM_SOLVING"),
        new QuestionDef("A10", "Which shape completes the pattern?", Arrays.asList("Circle", "Square", "Triangle", "Star"), "Triangle", "SPATIAL")
    );

    private static final List<QuestionDef> INTEREST_QUESTIONS = Arrays.asList(
        new QuestionDef("I1", "I enjoy writing code and building software.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "TECHNOLOGY"),
        new QuestionDef("I2", "I love understanding how machines work.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "ENGINEERING"),
        new QuestionDef("I3", "I want to help heal people and study biology.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "HEALTHCARE"),
        new QuestionDef("I4", "I am fascinated by stock markets and economics.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "FINANCE"),
        new QuestionDef("I5", "I enjoy sketching, painting, and visual arts.", Arrays.asList("Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"), null, "DESIGN")
    );

    private static class QuestionDef {
        String id; String question; List<String> options; String answer; String category;
        QuestionDef(String id, String question, List<String> options, String answer, String category) {
            this.id = id; this.question = question; this.options = options; this.answer = answer; this.category = category;
        }
    }

    public AssessmentService(StudentProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public List<AssessmentQuestionDto> getQuestions() {
        List<AssessmentQuestionDto> dtoList = new ArrayList<>();
        
        APTITUDE_QUESTIONS.forEach(q -> 
            dtoList.add(new AssessmentQuestionDto(q.id, q.question, q.options, q.category, "APTITUDE"))
        );
        INTEREST_QUESTIONS.forEach(q -> 
            dtoList.add(new AssessmentQuestionDto(q.id, q.question, q.options, q.category, "INTEREST"))
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
            result.setLogicalReasoning(aptitudeScores.getOrDefault("LOGICAL", 0).doubleValue());
            result.setNumericalReasoning(aptitudeScores.getOrDefault("NUMERICAL", 0).doubleValue());
            result.setVerbalReasoning(aptitudeScores.getOrDefault("VERBAL", 0).doubleValue());
            result.setProblemSolving(aptitudeScores.getOrDefault("PROBLEM_SOLVING", 0).doubleValue());
            result.setSpatialReasoning(aptitudeScores.getOrDefault("SPATIAL", 0).doubleValue());
            
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
"@
Set-Content -Path "$baseDir\service\AssessmentService.java" -Value $serviceCode

$controllerCode = @"
package com.careerpaths.controller;

import com.careerpaths.dto.assessment.*;
import com.careerpaths.service.AssessmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assessments")
@CrossOrigin(origins = "*")
public class AssessmentController {

    private final AssessmentService assessmentService;

    public AssessmentController(AssessmentService assessmentService) {
        this.assessmentService = assessmentService;
    }

    @GetMapping("/questions")
    public ResponseEntity<List<AssessmentQuestionDto>> getQuestions() {
        return ResponseEntity.ok(assessmentService.getQuestions());
    }

    @PostMapping("/submit/{studentId}")
    public ResponseEntity<AssessmentResultDto> submitAssessment(
            @PathVariable Long studentId,
            @RequestBody AssessmentSubmissionDto submission) {
        return ResponseEntity.ok(assessmentService.submitAssessment(studentId, submission));
    }
}
"@
Set-Content -Path "$baseDir\controller\AssessmentController.java" -Value $controllerCode

$testCode = @"
package com.careerpaths;

import com.careerpaths.controller.AssessmentController;
import com.careerpaths.dto.assessment.AssessmentSubmissionDto;
import com.careerpaths.dto.assessment.AssessmentResultDto;
import com.careerpaths.service.AssessmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AssessmentControllerTest {

    private MockMvc mockMvc;
    private AssessmentService assessmentService;

    @BeforeEach
    public void setup() {
        assessmentService = Mockito.mock(AssessmentService.class);
        AssessmentController controller = new AssessmentController(assessmentService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    public void testGetQuestions() throws Exception {
        mockMvc.perform(get("/api/assessments/questions"))
                .andExpect(status().isOk());
    }

    @Test
    public void testSubmitAssessment() throws Exception {
        AssessmentResultDto mockResponse = new AssessmentResultDto();
        
        Mockito.when(assessmentService.submitAssessment(eq(1L), any())).thenReturn(mockResponse);

        String json = "{\"answers\":{\"A1\":\"42\"}}";

        mockMvc.perform(post("/api/assessments/submit/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
    }
}
"@
Set-Content -Path "$baseDir\..\..\test\java\com\careerpaths\AssessmentControllerTest.java" -Value $testCode

