package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "aptitude_results")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AptitudeResult extends BaseEntity {
    @OneToOne
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    private Integer logicalReasoningScore;
    private Integer numericalReasoningScore;
    private Integer verbalReasoningScore;
    private Integer problemSolvingScore;
    private Integer spatialReasoningScore;
}
