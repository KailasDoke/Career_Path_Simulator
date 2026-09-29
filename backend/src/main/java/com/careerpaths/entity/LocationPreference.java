package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "location_preferences")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LocationPreference extends BaseEntity {
    @OneToOne
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    private String preferredCountry;
    private String preferredRegion;
    private Boolean willingToStudyAbroad;
    private String cityPreference;
}
