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
