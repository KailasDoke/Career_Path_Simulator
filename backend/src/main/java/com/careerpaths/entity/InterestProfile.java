package com.careerpaths.entity;

import com.careerpaths.entity.enums.InterestArea;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "interest_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InterestProfile extends BaseEntity {
    @OneToOne
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @ElementCollection(targetClass = InterestArea.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "profile_interests", joinColumns = @JoinColumn(name = "interest_profile_id"))
    @Column(name = "interest_area")
    private List<InterestArea> primaryInterests;

    private Integer technologyScore;
    private Integer engineeringScore;
    private Integer healthcareScore;
    private Integer businessScore;
    private Integer financeScore;
    private Integer designScore;
    private Integer researchScore;
    private Integer artsScore;
    private Integer socialSciencesScore;
    private Integer environmentScore;
}
