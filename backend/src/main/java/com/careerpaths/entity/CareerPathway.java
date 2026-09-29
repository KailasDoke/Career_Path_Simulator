package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "career_pathways")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CareerPathway extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "program_id", nullable = false)
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "career_id", nullable = false)
    private Career career;
    
    @Column(columnDefinition = "text")
    private String explanation;
}
