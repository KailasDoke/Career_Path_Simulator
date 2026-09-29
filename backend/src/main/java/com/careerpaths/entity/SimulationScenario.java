package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "simulation_scenarios")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SimulationScenario extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;
    
    private String scenarioName;
    
    @Column(columnDefinition = "text")
    private String parametersJson;
    
    @OneToOne(mappedBy = "scenario", cascade = CascadeType.ALL)
    private SimulationResult result;
}
