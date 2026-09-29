package com.careerpaths.service;

import com.careerpaths.dto.pathway.*;
import com.careerpaths.entity.*;
import com.careerpaths.entity.enums.CareerDomain;
import com.careerpaths.repository.CareerRepository;
import com.careerpaths.repository.ProgramRepository;
import com.careerpaths.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PathwayEngineService {

    private final StudentProfileRepository studentProfileRepository;
    private final ProgramRepository programRepository;
    private final CareerRepository careerRepository;

    public PathwayEngineService(StudentProfileRepository studentProfileRepository, ProgramRepository programRepository, CareerRepository careerRepository) {
        this.studentProfileRepository = studentProfileRepository;
        this.programRepository = programRepository;
        this.careerRepository = careerRepository;
    }

    public List<PathwayDto> generatePathways(Long studentId) {
        StudentProfile profile = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student Profile not found"));

        List<Program> allPrograms = programRepository.findAll();
        List<Career> allCareers = careerRepository.findAll();
        
        return generatePathways(profile, allPrograms, allCareers);
    }

    public List<PathwayDto> generatePathways(StudentProfile profile, List<Program> allPrograms, List<Career> allCareers) {
        List<PathwayDto> pathways = new ArrayList<>();

        // Generate Pathway 1: Top Academic Fit (Based on Highest Aptitude/Academic)
        pathways.add(generatePathway(profile, allPrograms, allCareers, "Strong academic alignment", "Academic"));
        
        // Generate Pathway 2: Budget Friendly (Based on lowest tuition vs budget)
        pathways.add(generatePathway(profile, allPrograms, allCareers, "Lower estimated cost", "Financial"));
        
        // Generate Pathway 3: Top Interest Fit (Based on Interest Profile)
        pathways.add(generatePathway(profile, allPrograms, allCareers, "Strong interest alignment", "Interest"));

        return pathways;
    }

    private PathwayDto generatePathway(StudentProfile profile, List<Program> programs, List<Career> careers, String name, String optimizationMode) {
        // Find best program according to mode
        Program bestProgram = findBestProgram(profile, programs, optimizationMode);
        
        PathwayDto dto = new PathwayDto();
        dto.setName(name);
        
        EducationStageDto stage = new EducationStageDto();
        stage.setStageName("Undergraduate / Primary Education");
        if (bestProgram != null) {
            stage.setProgramName(bestProgram.getName());
            stage.setDegree(bestProgram.getDegree());
            if (bestProgram.getInstitution() != null) {
                stage.setInstitutionName(bestProgram.getInstitution().getName());
            }
            if (bestProgram.getCountry() != null) {
                stage.setCountry(bestProgram.getCountry().getName());
            }
            stage.setDurationYears(bestProgram.getDurationYears());
            stage.setTuitionCost(bestProgram.getTotalTuition() != null ? bestProgram.getTotalTuition().doubleValue() : 0.0);
            
            dto.setTotalDurationYears(bestProgram.getDurationYears());
            dto.setEstimatedTotalCost(stage.getTuitionCost());
            
            if (bestProgram.getCareerDomains() != null) {
                dto.setCareerDomains(bestProgram.getCareerDomains().stream().map(Enum::name).collect(Collectors.toList()));
            } else {
                dto.setCareerDomains(new ArrayList<>());
            }
        }
        
        dto.setEducationStages(Arrays.asList(stage));
        
        // Calculate Fit Scores
        FitScoreDto scores = calculateFitScores(profile, bestProgram, optimizationMode);
        dto.setFitScores(scores);
        
        // Generate Explanation
        PathwayExplanationDto explanation = new PathwayExplanationDto();
        explanation.setAcademicExplanation(scores.getAcademicFit() > 70 ? "Strong academic alignment with program requirements." : "Academic fit is moderate.");
        explanation.setInterestExplanation(scores.getInterestFit() > 70 ? "Program aligns closely with your reported interests." : "Interest alignment is lower, but offers broad opportunities.");
        
        if (scores.getFinancialFit() > 70) {
            explanation.setFinancialExplanation("Current budget covers estimated cost.");
        } else {
            explanation.setFinancialExplanation("Requires additional funding (loans/scholarships).");
        }
        
        explanation.setAdmissionExplanation(scores.getAdmissionFit() > 70 ? "Known requirements appear compatible." : "Admission fit is uncertain.");
        explanation.setLocationExplanation(scores.getLocationFit() > 70 ? "Matches preferred locations." : "Location is outside primary preferences.");
        
        dto.setExplanation(explanation);
        
        dto.setFundingOpportunities(scores.getFinancialFit() < 60 ? Arrays.asList("Federal Student Loans", "University Merit Scholarships") : Arrays.asList("Not urgently required"));
        dto.setAssumptions(Arrays.asList("Assumes full-time study", "Tuition fees are subject to change"));
        dto.setUncertainties(Arrays.asList("Admission is competitive and not guaranteed"));
        
        return dto;
    }
    
    private Program findBestProgram(StudentProfile profile, List<Program> programs, String mode) {
        if (programs.isEmpty()) return null;
        
        return programs.stream().max((p1, p2) -> {
            int score1 = calculateModeScore(profile, p1, mode);
            int score2 = calculateModeScore(profile, p2, mode);
            return Integer.compare(score1, score2);
        }).orElse(programs.get(0));
    }
    
    private int calculateModeScore(StudentProfile profile, Program program, String mode) {
        if ("Financial".equals(mode)) {
            double budget = profile.getFinancialProfile() != null && profile.getFinancialProfile().getMaximumTotalBudget() != null 
                ? profile.getFinancialProfile().getMaximumTotalBudget().doubleValue() : 50000;
            double cost = program.getTotalTuition() != null ? program.getTotalTuition().doubleValue() : 0.0;
            return cost <= budget ? (int)(100 - (cost/budget)*50) : (int)((budget/cost)*50);
        } else if ("Interest".equals(mode)) {
            // Simplified: check if program domain matches high interest score
            if (profile.getInterestProfile() == null || program.getCareerDomains() == null || program.getCareerDomains().isEmpty()) return 50;
            int maxScore = 0;
            for (CareerDomain domain : program.getCareerDomains()) {
                int score = getInterestScoreForDomain(profile.getInterestProfile(), domain);
                if (score > maxScore) maxScore = score;
            }
            return maxScore;
        } else {
            // Academic
            return 85; // Mock academic score logic
        }
    }
    
    private int getInterestScoreForDomain(InterestProfile ip, CareerDomain domain) {
        switch (domain) {
            case SOFTWARE_ENGINEERING: return ip.getTechnologyScore() != null ? ip.getTechnologyScore() : 50;
            case ENGINEERING: return ip.getEngineeringScore() != null ? ip.getEngineeringScore() : 50;
            case DATA: return ip.getTechnologyScore() != null ? ip.getTechnologyScore() : 50;
            case HEALTHCARE: return ip.getHealthcareScore() != null ? ip.getHealthcareScore() : 50;
            case FINANCE: return ip.getFinanceScore() != null ? ip.getFinanceScore() : 50;
            case BUSINESS: return ip.getBusinessScore() != null ? ip.getBusinessScore() : 50;
            case RESEARCH: return ip.getResearchScore() != null ? ip.getResearchScore() : 50;
            case DESIGN: return ip.getDesignScore() != null ? ip.getDesignScore() : 50;
            case ENVIRONMENT: return ip.getEnvironmentScore() != null ? ip.getEnvironmentScore() : 50;
            default: return 50;
        }
    }

    private FitScoreDto calculateFitScores(StudentProfile profile, Program program, String optimizationMode) {
        int academic = 80;
        int interest = 80;
        int financial = 80;
        int location = 80;
        int admission = 80;
        
        if (program != null) {
            if ("Financial".equals(optimizationMode)) {
                financial = 95;
            } else {
                double budget = profile.getFinancialProfile() != null && profile.getFinancialProfile().getMaximumTotalBudget() != null 
                    ? profile.getFinancialProfile().getMaximumTotalBudget().doubleValue() : 50000;
                double cost = program.getTotalTuition() != null ? program.getTotalTuition().doubleValue() : 0.0;
                financial = cost <= budget ? 90 : (int)((budget/cost)*70);
                if (financial > 100) financial = 100;
            }
            
            if ("Interest".equals(optimizationMode)) {
                interest = 95;
            } else if (profile.getInterestProfile() != null && program.getCareerDomains() != null) {
                int maxScore = 50;
                for (CareerDomain domain : program.getCareerDomains()) {
                    int score = getInterestScoreForDomain(profile.getInterestProfile(), domain);
                    if (score > maxScore) maxScore = score;
                }
                interest = maxScore;
            }
            
            if (profile.getLocationPreference() != null && profile.getLocationPreference().getPreferredCountry() != null && program.getCountry() != null) {
                boolean matches = profile.getLocationPreference().getPreferredCountry().equalsIgnoreCase(program.getCountry().getName());
                location = matches ? 95 : 40;
            }
        }

        int overall = (int) (academic * 0.25 + interest * 0.25 + financial * 0.20 + location * 0.10 + admission * 0.20);
        
        return FitScoreDto.builder()
                .academicFit(academic)
                .interestFit(interest)
                .financialFit(financial)
                .locationFit(location)
                .admissionFit(admission)
                .overallFit(overall)
                .build();
    }
}
