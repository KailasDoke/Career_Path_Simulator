package com.careerpaths;

import com.careerpaths.entity.Country;
import com.careerpaths.repository.CountryRepository;
import com.careerpaths.repository.ProgramRepository;
import com.careerpaths.controller.KnowledgeBaseController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
public class KnowledgeBaseIntegrationTest {

    private MockMvc mockMvc;

    @Autowired
    private KnowledgeBaseController knowledgeBaseController;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private ProgramRepository programRepository;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(knowledgeBaseController).build();
    }

    @Test
    public void testSeedDataAndSourceMetadata() {
        Country india = countryRepository.findAll().stream()
                .filter(c -> "India".equals(c.getName()))
                .findFirst().orElse(null);

        assertTrue(india != null, "Seeded data for India should exist");
        assertEquals("DEMO", india.getSourceType(), "SourceType should be DEMO");
        assertEquals("UNVERIFIED", india.getVerificationStatus(), "VerificationStatus should be UNVERIFIED");
        assertEquals("Demo Dataset", india.getSource(), "Source should be Demo Dataset");
    }

    @Test
    public void testRepositoryQueriesAndFiltering() {
        var allPrograms = programRepository.findAll();
        assertTrue(allPrograms.size() >= 2, "Should have at least 2 seeded programs");
    }

    @Test
    public void testApiResponsesAndFiltering() throws Exception {
        // Test GET /api/countries
        mockMvc.perform(get("/api/countries"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].name").exists())
                .andExpect(jsonPath("$[0].sourceType").value("DEMO"));

        // Test GET /api/programs
        mockMvc.perform(get("/api/programs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());

        // Test filtering by degree
        mockMvc.perform(get("/api/programs?degree=B.Tech"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].name").value("B.Tech Computer Science"));
    }
}
