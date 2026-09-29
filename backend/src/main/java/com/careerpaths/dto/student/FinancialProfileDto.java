package com.careerpaths.dto.student;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class FinancialProfileDto {
    @Min(value = 0, message = "Budget cannot be negative")
    private BigDecimal annualEducationBudget;
    
    @Min(value = 0, message = "Budget cannot be negative")
    private BigDecimal maximumTotalBudget;
    
    @Min(value = 0, message = "Contribution cannot be negative")
    private BigDecimal familyContribution;
    
    private Boolean requiresScholarship;
    private Boolean willingToTakeLoan;
    
    @Min(value = 0, message = "EMI cannot be negative")
    private BigDecimal maximumComfortableEmi;
}
