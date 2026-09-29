package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "financial_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FinancialProfile extends BaseEntity {
    @OneToOne
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    private BigDecimal annualEducationBudget;
    private BigDecimal maximumTotalBudget;
    private BigDecimal familyContribution;
    
    private Boolean requiresScholarship;
    private Boolean willingToTakeLoan;
    private BigDecimal maximumComfortableEmi;
}
