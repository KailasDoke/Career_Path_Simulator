package com.careerpaths.dto.pathway;

import lombok.Data;
import java.util.List;

@Data
public class PathwayDto {
    private String name;
    private List<EducationStageDto> educationStages;
    private List<String> careerDomains;
    private Double totalDurationYears;
    private Double estimatedTotalCost;
    private FitScoreDto fitScores;
    private PathwayExplanationDto explanation;
    private List<String> fundingOpportunities;
    private List<String> assumptions;
    private List<String> uncertainties;
}
