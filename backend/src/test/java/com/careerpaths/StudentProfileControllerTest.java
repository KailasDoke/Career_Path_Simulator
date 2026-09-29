package com.careerpaths;

import com.careerpaths.controller.StudentProfileController;
import com.careerpaths.dto.student.StudentProfileDto;
import com.careerpaths.service.StudentProfileService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

public class StudentProfileControllerTest {

    private MockMvc mockMvc;
    private StudentProfileService profileService;

    @BeforeEach
    public void setup() {
        profileService = Mockito.mock(StudentProfileService.class);
        StudentProfileController controller = new StudentProfileController(profileService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    public void testCreateProfileInvalid() throws Exception {
        String invalidJson = "{}";

        mockMvc.perform(post("/api/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(invalidJson))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void testCreateProfileValid() throws Exception {
        StudentProfileDto mockResponse = new StudentProfileDto();
        mockResponse.setId(1L);
        mockResponse.setFirstName("John");
        mockResponse.setLastName("Doe");

        Mockito.when(profileService.createProfile(any())).thenReturn(mockResponse);

        String validJson = "{\"firstName\":\"John\", \"lastName\":\"Doe\"}";

        mockMvc.perform(post("/api/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(validJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());
    }
}
