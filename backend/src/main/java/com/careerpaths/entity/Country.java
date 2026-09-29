package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "countries")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Country extends KnowledgeBaseEntity {
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String code;

    @OneToMany(mappedBy = "country")
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<Institution> institutions;
}
