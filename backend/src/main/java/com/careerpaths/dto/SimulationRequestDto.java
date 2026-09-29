package com.careerpaths.dto;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class SimulationRequestDto {
    private String type; // BUDGET_CHANGE, PROGRAM_UNAVAILABLE, SCHOLARSHIP_RECEIVED, ACADEMIC_CHANGE
    private BigDecimal newBudget;
    private Long excludedProgramId;
    private BigDecimal newScholarshipAmount;
    private Double newGpa;
}
