package com.careerpaths.dto;

import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class SimulationResultDto {
    private String scenarioDescription;
    private List<SimulationPathwayComparisonDto> pathwayComparisons;
}
