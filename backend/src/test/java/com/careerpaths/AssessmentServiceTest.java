package com.careerpaths;

import com.careerpaths.dto.assessment.AssessmentResultDto;
import com.careerpaths.dto.assessment.AssessmentSubmissionDto;
import com.careerpaths.entity.AptitudeResult;
import com.careerpaths.entity.InterestProfile;
import com.careerpaths.entity.StudentProfile;
import com.careerpaths.repository.StudentProfileRepository;
import com.careerpaths.service.AssessmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class AssessmentServiceTest {

    private AssessmentService assessmentService;
    private StudentProfileRepository profileRepository;

    @BeforeEach
    public void setup() {
        profileRepository = Mockito.mock(StudentProfileRepository.class);
        assessmentService = new AssessmentService(profileRepository);
    }

    @Test
    public void testQuestionRetrieval() {
        var questions = assessmentService.getQuestions();
        assertNotNull(questions);
        assertEquals(20, questions.size()); // 10 aptitude + 10 interest
    }

    @Test
    public void testAnswerSubmissionAndScoreCalculation() {
        AssessmentSubmissionDto submission = new AssessmentSubmissionDto();
        Map<String, String> answers = new HashMap<>();
        answers.put("A1", "42"); // Correct NUMERICAL
        answers.put("A2", "Yes"); // Incorrect LOGICAL
        answers.put("I1", "Strongly Agree"); // TECHNOLOGY 100
        submission.setAnswers(answers);

        StudentProfile profile = new StudentProfile();
        when(profileRepository.findById(1L)).thenReturn(Optional.of(profile));

        AssessmentResultDto result = assessmentService.submitAssessment(1L, submission);

        assertNotNull(result);
        assertEquals(50, result.getAptitudeScores().get("NUMERICAL")); // 1 out of 2 correct (A1, A6)
        assertEquals(0, result.getAptitudeScores().get("LOGICAL")); // 0 out of 2 correct
        assertEquals(100, result.getInterestScores().get("TECHNOLOGY"));

        // Profile persistence tested
        verify(profileRepository, times(1)).save(profile);
        assertNotNull(profile.getAptitudeResult());
        assertNotNull(profile.getInterestProfile());
        assertEquals(50, profile.getAptitudeResult().getNumericalReasoningScore());
        assertEquals(100, profile.getInterestProfile().getTechnologyScore());
    }

    @Test
    public void testInvalidSubmissions() {
        AssessmentSubmissionDto submission = new AssessmentSubmissionDto();
        // Empty answers
        submission.setAnswers(new HashMap<>());

        StudentProfile profile = new StudentProfile();
        when(profileRepository.findById(1L)).thenReturn(Optional.of(profile));

        AssessmentResultDto result = assessmentService.submitAssessment(1L, submission);

        assertNotNull(result);
        assertEquals(0, result.getAptitudeScores().get("NUMERICAL"));
        assertEquals(0, result.getAptitudeScores().get("LOGICAL"));
        // Neutral default for interests is 50 when no answer is provided based on the implementation
        assertEquals(50, result.getInterestScores().get("TECHNOLOGY"));
    }
}
