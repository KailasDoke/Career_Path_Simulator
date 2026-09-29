package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "academic_records")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AcademicRecord extends BaseEntity {
    @OneToOne
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    private Double class10Percentage;
    
    @Column(columnDefinition = "text")
    private String subjectMarks; // JSON representation of subject marks
    
    @Column(columnDefinition = "text")
    private String academicStrengths;
}
