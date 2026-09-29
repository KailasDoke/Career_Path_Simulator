package com.careerpaths;

import com.careerpaths.dto.pathway.PathwayDto;
import com.careerpaths.entity.*;
import com.careerpaths.entity.enums.CareerDomain;
import com.careerpaths.repository.CareerRepository;
import com.careerpaths.repository.ProgramRepository;
import com.careerpaths.repository.StudentProfileRepository;
import com.careerpaths.service.PathwayEngineService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class PathwayEngineServiceTest {

    private PathwayEngineService pathwayEngineService;
    private StudentProfileRepository studentProfileRepository;
    private ProgramRepository programRepository;
    private CareerRepository careerRepository;

    private Program expensiveProgram;
    private Program cheapProgram;
    private Program designProgram;

    @BeforeEach
    public void setup() {
        studentProfileRepository = Mockito.mock(StudentProfileRepository.class);
        programRepository = Mockito.mock(ProgramRepository.class);
        careerRepository = Mockito.mock(CareerRepository.class);

        pathwayEngineService = new PathwayEngineService(studentProfileRepository, programRepository, careerRepository);

        expensiveProgram = new Program();
        expensiveProgram.setName("Expensive CS");
        expensiveProgram.setTotalTuition(new BigDecimal("100000"));
        expensiveProgram.setCareerDomains(Arrays.asList(CareerDomain.SOFTWARE_ENGINEERING));

        cheapProgram = new Program();
        cheapProgram.setName("Cheap CS");
        cheapProgram.setTotalTuition(new BigDecimal("10000"));
        cheapProgram.setCareerDomains(Arrays.asList(CareerDomain.SOFTWARE_ENGINEERING));

        designProgram = new Program();
        designProgram.setName("Design B.Des");
        designProgram.setTotalTuition(new BigDecimal("30000"));
        designProgram.setCareerDomains(Arrays.asList(CareerDomain.DESIGN));

        when(programRepository.findAll()).thenReturn(Arrays.asList(expensiveProgram, cheapProgram, designProgram));
    }

    @Test
    public void testStudentALowerBudget() {
        StudentProfile studentB = new StudentProfile();
        studentB.setId(2L);
        FinancialProfile fp = new FinancialProfile();
        fp.setMaximumTotalBudget(new BigDecimal("15000")); // Very low budget
        studentB.setFinancialProfile(fp);

        when(studentProfileRepository.findById(2L)).thenReturn(Optional.of(studentB));

        List<PathwayDto> pathways = pathwayEngineService.generatePathways(2L);
        assertNotNull(pathways);
        assertEquals(3, pathways.size());
        
        // Find the "Lower estimated cost" pathway
        PathwayDto financialPathway = pathways.stream().filter(p -> p.getName().equals("Lower estimated cost")).findFirst().orElseThrow();
        assertEquals("Cheap CS", financialPathway.getEducationStages().get(0).getProgramName());
        assertTrue(financialPathway.getFitScores().getFinancialFit() > 80);
    }

    @Test
    public void testStudentCInterestProfile() {
        StudentProfile studentC = new StudentProfile();
        studentC.setId(3L);
        InterestProfile ip = new InterestProfile();
        ip.setDesignScore(100);
        ip.setTechnologyScore(20);
        studentC.setInterestProfile(ip);
        FinancialProfile fp = new FinancialProfile();
        fp.setMaximumTotalBudget(new BigDecimal("50000")); 
        studentC.setFinancialProfile(fp);

        when(studentProfileRepository.findById(3L)).thenReturn(Optional.of(studentC));

        List<PathwayDto> pathways = pathwayEngineService.generatePathways(3L);
        
        // Find the "Strong interest alignment" pathway
        PathwayDto interestPathway = pathways.stream().filter(p -> p.getName().equals("Strong interest alignment")).findFirst().orElseThrow();
        assertEquals("Design B.Des", interestPathway.getEducationStages().get(0).getProgramName());
        assertEquals(95, interestPathway.getFitScores().getInterestFit());
    }
}
