package com.careerpaths.dto;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;

@Data
@Builder
public class PathwayFundingDto {
    private String pathwayName;
    private BigDecimal estimatedTotalCost;
    private BigDecimal familyContribution;
    private BigDecimal scholarshipEstimate;
    private BigDecimal estimatedFundingGap;
    private BigDecimal potentialLoanRequirement;
    private boolean isEstimate;
}
