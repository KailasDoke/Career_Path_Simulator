package com.careerpaths.entity;

import com.careerpaths.entity.enums.EducationLevel;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

import com.careerpaths.entity.enums.CareerDomain;

@Entity
@Table(name = "programs", indexes = {
    @Index(name = "idx_program_institution", columnList = "institution_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Program extends KnowledgeBaseEntity {
    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "institution_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Institution institution;

    @Enumerated(EnumType.STRING)
    private EducationLevel educationLevel;

    private Double durationYears;
    private BigDecimal totalTuition;
    private String degree;
    
    @ManyToOne
    @JoinColumn(name = "country_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Country country;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "program_admission_requirements", joinColumns = @JoinColumn(name = "program_id"))
    private List<AdmissionRequirement> admissionRequirements;

    @ElementCollection(targetClass = CareerDomain.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "program_career_domains", joinColumns = @JoinColumn(name = "program_id"))
    private List<CareerDomain> careerDomains;
    @OneToMany(mappedBy = "program")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<CareerPathway> pathways;
    
    @ManyToMany(mappedBy = "eligiblePrograms")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Scholarship> scholarships;
}
