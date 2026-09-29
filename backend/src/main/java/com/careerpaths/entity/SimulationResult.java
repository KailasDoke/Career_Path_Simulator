package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "simulation_results")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SimulationResult extends BaseEntity {
    @OneToOne
    @JoinColumn(name = "scenario_id", nullable = false)
    private SimulationScenario scenario;
    
    @Column(columnDefinition = "text")
    private String resultDataJson;
}
