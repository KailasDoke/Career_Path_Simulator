package com.careerpaths;

import com.careerpaths.dto.pathway.PathwayDto;
import com.careerpaths.service.PathwayEngineService;
import com.careerpaths.controller.PathwayController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class PathwayControllerTest {

    private MockMvc mockMvc;
    private PathwayEngineService pathwayEngineService;

    @BeforeEach
    public void setup() {
        pathwayEngineService = Mockito.mock(PathwayEngineService.class);
        PathwayController controller = new PathwayController(pathwayEngineService);
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
    }

    @Test
    public void testGeneratePathways() throws Exception {
        when(pathwayEngineService.generatePathways(anyLong())).thenReturn(Collections.singletonList(new PathwayDto()));

        String json = "{\"studentId\": 1}";

        mockMvc.perform(post("/api/pathways/generate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
    }
}
