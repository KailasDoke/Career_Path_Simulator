package com.careerpaths.entity;

import com.careerpaths.entity.enums.InstitutionType;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.math.BigDecimal;

@Entity
@Table(name = "institutions", indexes = {
    @Index(name = "idx_institution_country", columnList = "country_id")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Institution extends KnowledgeBaseEntity {
    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "country_id")
    @com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Country country;

    private String stateRegion;
    private String city;

    @Enumerated(EnumType.STRING)
    private InstitutionType type;

    private BigDecimal estimatedLivingCostAnnual;

    @OneToMany(mappedBy = "institution")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Program> programs;
}
