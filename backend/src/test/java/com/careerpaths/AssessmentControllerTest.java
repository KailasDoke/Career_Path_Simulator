package com.careerpaths;

import com.careerpaths.controller.AssessmentController;

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
