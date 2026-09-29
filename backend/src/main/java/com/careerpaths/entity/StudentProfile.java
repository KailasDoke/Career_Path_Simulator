package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "student_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentProfile extends BaseEntity {
    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne(mappedBy = "studentProfile", cascade = CascadeType.ALL)
    private AcademicRecord academicRecord;

    @OneToOne(mappedBy = "studentProfile", cascade = CascadeType.ALL)
    private InterestProfile interestProfile;

    @OneToOne(mappedBy = "studentProfile", cascade = CascadeType.ALL)
    private FinancialProfile financialProfile;

    @OneToOne(mappedBy = "studentProfile", cascade = CascadeType.ALL)
    private LocationPreference locationPreference;

    @OneToOne(mappedBy = "studentProfile", cascade = CascadeType.ALL)
    private AptitudeResult aptitudeResult;
}
