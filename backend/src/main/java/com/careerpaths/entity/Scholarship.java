package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "scholarships")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Scholarship extends KnowledgeBaseEntity {
    @Column(nullable = false)
    private String name;
    
    private String provider;
    
    @Column(columnDefinition = "text")
    private String eligibilityCriteria;
    
    private BigDecimal benefitAmount;
    
    // Structured matching criteria
    private BigDecimal maxFamilyIncome;
    private Double minGpa;
    private String targetCountryCode; // e.g. IN, DE, CA
    private String requiredEducationLevel; // e.g. UG, PG
    
    @Column(columnDefinition = "text")
    private String requiredDocuments;
    
    @Column(columnDefinition = "text")
    private String applicationInformation;
    
    @ManyToMany
    @JoinTable(
        name = "scholarship_programs",
        joinColumns = @JoinColumn(name = "scholarship_id"),
        inverseJoinColumns = @JoinColumn(name = "program_id")
    )
    private List<Program> eligiblePrograms;
}
