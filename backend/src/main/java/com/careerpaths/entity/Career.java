package com.careerpaths.entity;

import com.careerpaths.entity.enums.CareerDomain;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "careers")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Career extends KnowledgeBaseEntity {
    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    private CareerDomain domain;

    @Column(columnDefinition = "text")
    private String description;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "career_prerequisites", joinColumns = @JoinColumn(name = "career_id"))
    private List<String> prerequisiteAreas;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "career_higher_ed_paths", joinColumns = @JoinColumn(name = "career_id"))
    private List<String> possibleHigherEducationPaths;

    @OneToMany(mappedBy = "career")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<CareerPathway> pathways;
}
