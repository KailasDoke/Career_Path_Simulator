package com.careerpaths.dto;

import com.careerpaths.dto.pathway.PathwayDto;
import lombok.Data;
import lombok.Builder;
import java.util.List;

@Data
@Builder
public class SimulationPathwayComparisonDto {
    private String pathwayName;
    private String programName;
    private PathwayDto beforePathway;
    private PathwayDto afterPathway;
    private String beforeStatus; // e.g. "Feasible"
    private String afterStatus;  // e.g. "Requires additional funding"
    private String explanation;
}
