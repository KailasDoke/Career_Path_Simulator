package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "education_loans")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EducationLoan extends KnowledgeBaseEntity {
    @Column(nullable = false)
    private String lenderName;

    private BigDecimal maxLoanAmount;
    private Double interestRate;
    private String interestType; // FIXED, FLOATING
    private Integer maxTenureMonths;
    private Integer moratoriumMonths;
    private BigDecimal processingFee;
    private Boolean collateralRequired;
}
