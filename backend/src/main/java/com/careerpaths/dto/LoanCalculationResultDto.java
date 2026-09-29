package com.careerpaths.dto;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;

@Data
@Builder
public class LoanCalculationResultDto {
    private String lenderName;
    private BigDecimal loanAmount;
    private Double interestRate;
    private Integer tenureMonths;
    private Integer moratoriumMonths;
    private BigDecimal processingFee;
    private Boolean collateralRequired;
    
    // Calculated values
    private BigDecimal estimatedEmi;
    private BigDecimal estimatedTotalInterest;
    private BigDecimal estimatedTotalRepayment;
    
    private String assumptions;
}
