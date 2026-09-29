package com.careerpaths.service;

import com.careerpaths.dto.SimulationPathwayComparisonDto;
import com.careerpaths.dto.SimulationRequestDto;
import com.careerpaths.dto.SimulationResultDto;
import com.careerpaths.dto.pathway.PathwayDto;
import com.careerpaths.entity.Career;
import com.careerpaths.entity.FinancialProfile;
import com.careerpaths.entity.Program;
import com.careerpaths.entity.StudentProfile;
import com.careerpaths.repository.CareerRepository;
import com.careerpaths.repository.ProgramRepository;
import com.careerpaths.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class SimulationService {

    private final StudentProfileRepository profileRepository;
    private final ProgramRepository programRepository;
    private final CareerRepository careerRepository;
    private final PathwayEngineService pathwayEngineService;

    public SimulationService(StudentProfileRepository profileRepository, 
                             ProgramRepository programRepository, 
                             CareerRepository careerRepository,
                             PathwayEngineService pathwayEngineService) {
        this.profileRepository = profileRepository;
        this.programRepository = programRepository;
        this.careerRepository = careerRepository;
        this.pathwayEngineService = pathwayEngineService;
    }

    public SimulationResultDto runSimulation(Long studentId, SimulationRequestDto request) {
        StudentProfile original = profileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        List<Program> originalPrograms = programRepository.findAll();
        List<Career> allCareers = careerRepository.findAll();

        // 1. Generate BEFORE pathways
        List<PathwayDto> beforePathways = pathwayEngineService.generatePathways(original, originalPrograms, allCareers);

        // 2. Clone and Modify for AFTER
        // Note: In a real app we'd deep clone the entity. For demo, we just simulate by manipulating a shallow copy's related objects
        // However, we shouldn't save this to DB.
        StudentProfile simulatedProfile = cloneProfile(original);
        List<Program> simulatedPrograms = new ArrayList<>(originalPrograms);
        String scenarioDescription = "Custom Simulation";

        if ("BUDGET_CHANGE".equals(request.getType())) {
            if (simulatedProfile.getFinancialProfile() == null) {
                simulatedProfile.setFinancialProfile(new FinancialProfile());
            }
            simulatedProfile.getFinancialProfile().setMaximumTotalBudget(request.getNewBudget());
            scenarioDescription = "Budget changed to " + request.getNewBudget();
        } else if ("PROGRAM_UNAVAILABLE".equals(request.getType())) {
            simulatedPrograms.removeIf(p -> p.getId().equals(request.getExcludedProgramId()));
            scenarioDescription = "Excluded primary program choice due to admission failure";
        } else if ("SCHOLARSHIP_RECEIVED".equals(request.getType())) {
            if (simulatedProfile.getFinancialProfile() == null) {
                simulatedProfile.setFinancialProfile(new FinancialProfile());
                simulatedProfile.getFinancialProfile().setMaximumTotalBudget(BigDecimal.ZERO);
            }
            BigDecimal current = simulatedProfile.getFinancialProfile().getMaximumTotalBudget() != null 
                ? simulatedProfile.getFinancialProfile().getMaximumTotalBudget() : BigDecimal.ZERO;
            simulatedProfile.getFinancialProfile().setMaximumTotalBudget(current.add(request.getNewScholarshipAmount()));
            scenarioDescription = "Received scholarship of " + request.getNewScholarshipAmount() + " (added to budget)";
        } else if ("NO_LOAN".equals(request.getType())) {
             if (simulatedProfile.getFinancialProfile() != null) {
                 simulatedProfile.getFinancialProfile().setWillingToTakeLoan(false);
                 scenarioDescription = "Student refused to take education loan";
             }
        }

        // 3. Generate AFTER pathways
        List<PathwayDto> afterPathways = pathwayEngineService.generatePathways(simulatedProfile, simulatedPrograms, allCareers);

        // 4. Compare
        List<SimulationPathwayComparisonDto> comparisons = new ArrayList<>();
        for (int i = 0; i < beforePathways.size(); i++) {
            PathwayDto before = beforePathways.get(i);
            PathwayDto after = afterPathways.get(i); // Assuming deterministic index order

            String beforeStatus = before.getFitScores().getFinancialFit() >= 60 ? "Feasible" : "Requires Funding";
            String afterStatus = after.getFitScores().getFinancialFit() >= 60 ? "Feasible" : "Infeasible / Requires Funding";
            
            String explanation = "No significant change.";
            if (before.getFitScores().getFinancialFit() >= 60 && after.getFitScores().getFinancialFit() < 60) {
                explanation = "Pathway became financially infeasible because the new budget cannot cover the estimated cost of $" + after.getEstimatedTotalCost();
            } else if (before.getFitScores().getFinancialFit() < 60 && after.getFitScores().getFinancialFit() >= 60) {
                explanation = "Pathway became feasible due to increased budget or scholarship.";
            } else if (!before.getEducationStages().get(0).getProgramName().equals(after.getEducationStages().get(0).getProgramName())) {
                explanation = "Original program was unavailable, so the engine pivoted to an alternative program: " + after.getEducationStages().get(0).getProgramName();
            }

            comparisons.add(SimulationPathwayComparisonDto.builder()
                .pathwayName(before.getName())
                .programName(before.getEducationStages().get(0).getProgramName())
                .beforePathway(before)
                .afterPathway(after)
                .beforeStatus(beforeStatus)
                .afterStatus(afterStatus)
                .explanation(explanation)
                .build());
        }

        return SimulationResultDto.builder()
            .scenarioDescription(scenarioDescription)
            .pathwayComparisons(comparisons)
            .build();
    }

    private StudentProfile cloneProfile(StudentProfile original) {
        StudentProfile copy = new StudentProfile();
        copy.setId(original.getId());
        copy.setFirstName(original.getFirstName());
        
        FinancialProfile fCopy = new FinancialProfile();
        if (original.getFinancialProfile() != null) {
            fCopy.setMaximumTotalBudget(original.getFinancialProfile().getMaximumTotalBudget());
            fCopy.setWillingToTakeLoan(original.getFinancialProfile().getWillingToTakeLoan());
        }
        copy.setFinancialProfile(fCopy);
        
        copy.setAcademicRecord(original.getAcademicRecord());
        copy.setInterestProfile(original.getInterestProfile());
        copy.setLocationPreference(original.getLocationPreference());
        copy.setAptitudeResult(original.getAptitudeResult());
        
        return copy;
    }
}
