$dir = "C:\Users\kaila\Downloads\Career\career-path-simulator\backend\src\main\java\com\careerpaths\entity"

$entities = @{
    "User" = @"
package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = `"users`")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String passwordHash;

    @OneToOne(mappedBy = `"user`", cascade = CascadeType.ALL)
    private StudentProfile studentProfile;
}
"@

    "StudentProfile" = @"
package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = `"student_profiles`")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudentProfile extends BaseEntity {
    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @OneToOne
    @JoinColumn(name = `"user_id`", nullable = false)
    private User user;

    @OneToOne(mappedBy = `"studentProfile`", cascade = CascadeType.ALL)
    private AcademicRecord academicRecord;

    @OneToOne(mappedBy = `"studentProfile`", cascade = CascadeType.ALL)
    private InterestProfile interestProfile;

    @OneToOne(mappedBy = `"studentProfile`", cascade = CascadeType.ALL)
    private FinancialProfile financialProfile;

    @OneToOne(mappedBy = `"studentProfile`", cascade = CascadeType.ALL)
    private LocationPreference locationPreference;

    @OneToOne(mappedBy = `"studentProfile`", cascade = CascadeType.ALL)
    private AptitudeResult aptitudeResult;
}
"@

    "AcademicRecord" = @"
package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = `"academic_records`")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AcademicRecord extends BaseEntity {
    @OneToOne
    @JoinColumn(name = `"student_profile_id`", nullable = false)
    private StudentProfile studentProfile;

    private Double class10Percentage;
    
    @Column(columnDefinition = `"text`")
    private String subjectMarks; // JSON representation of subject marks
    
    @Column(columnDefinition = `"text`")
    private String academicStrengths;
}
"@

    "InterestProfile" = @"
package com.careerpaths.entity;

import com.careerpaths.entity.enums.InterestArea;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = `"interest_profiles`")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InterestProfile extends BaseEntity {
    @OneToOne
    @JoinColumn(name = `"student_profile_id`", nullable = false)
    private StudentProfile studentProfile;

    @ElementCollection(targetClass = InterestArea.class)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = `"profile_interests`", joinColumns = @JoinColumn(name = `"interest_profile_id`"))
    @Column(name = `"interest_area`")
    private List<InterestArea> primaryInterests;
}
"@

    "FinancialProfile" = @"
package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = `"financial_profiles`")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FinancialProfile extends BaseEntity {
    @OneToOne
    @JoinColumn(name = `"student_profile_id`", nullable = false)
    private StudentProfile studentProfile;

    private BigDecimal annualEducationBudget;
    private BigDecimal maximumTotalBudget;
    private BigDecimal familyContribution;
    
    private Boolean requiresScholarship;
    private Boolean willingToTakeLoan;
    private BigDecimal maximumComfortableEmi;
}
"@

    "LocationPreference" = @"
package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = `"location_preferences`")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LocationPreference extends BaseEntity {
    @OneToOne
    @JoinColumn(name = `"student_profile_id`", nullable = false)
    private StudentProfile studentProfile;

    private String preferredCountry;
    private String preferredRegion;
    private Boolean willingToStudyAbroad;
    private String cityPreference;
}
"@

    "AptitudeResult" = @"
package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = `"aptitude_results`")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AptitudeResult extends BaseEntity {
    @OneToOne
    @JoinColumn(name = `"student_profile_id`", nullable = false)
    private StudentProfile studentProfile;

    private Integer logicalReasoningScore;
    private Integer numericalReasoningScore;
    private Integer verbalReasoningScore;
    private Integer problemSolvingScore;
    private Integer spatialReasoningScore;
}
"@

    "Country" = @"
package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = `"countries`")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Country extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(nullable = false, unique = true)
    private String code;

    @OneToMany(mappedBy = `"country`")
    private List<Institution> institutions;
}
"@

    "Institution" = @"
package com.careerpaths.entity;

import com.careerpaths.entity.enums.InstitutionType;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.math.BigDecimal;

@Entity
@Table(name = `"institutions`", indexes = {
    @Index(name = `"idx_institution_country`", columnList = `"country_id`")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Institution extends BaseEntity {
    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = `"country_id`")
    private Country country;

    private String stateRegion;
    private String city;

    @Enumerated(EnumType.STRING)
    private InstitutionType type;

    private BigDecimal estimatedLivingCostAnnual;

    @OneToMany(mappedBy = `"institution`")
    private List<Program> programs;
}
"@

    "Program" = @"
package com.careerpaths.entity;

import com.careerpaths.entity.enums.EducationLevel;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = `"programs`", indexes = {
    @Index(name = `"idx_program_institution`", columnList = `"institution_id`")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Program extends BaseEntity {
    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = `"institution_id`", nullable = false)
    private Institution institution;

    @Enumerated(EnumType.STRING)
    private EducationLevel educationLevel;

    private Double durationYears;
    private BigDecimal totalTuition;
    
    @Column(columnDefinition = `"text`")
    private String admissionRequirements;

    @OneToMany(mappedBy = `"program`")
    private List<CareerPathway> pathways;
    
    @ManyToMany(mappedBy = `"eligiblePrograms`")
    private List<Scholarship> scholarships;
}
"@

    "Career" = @"
package com.careerpaths.entity;

import com.careerpaths.entity.enums.CareerDomain;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = `"careers`")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Career extends BaseEntity {
    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    private CareerDomain domain;

    @Column(columnDefinition = `"text`")
    private String description;
    
    @OneToMany(mappedBy = `"career`")
    private List<CareerPathway> pathways;
}
"@

    "CareerPathway" = @"
package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = `"career_pathways`")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CareerPathway extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = `"program_id`", nullable = false)
    private Program program;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = `"career_id`", nullable = false)
    private Career career;
    
    @Column(columnDefinition = `"text`")
    private String explanation;
}
"@

    "Scholarship" = @"
package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = `"scholarships`")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Scholarship extends BaseEntity {
    @Column(nullable = false)
    private String name;
    
    private String provider;
    
    @Column(columnDefinition = `"text`")
    private String eligibilityCriteria;
    
    private BigDecimal benefitAmount;
    
    @ManyToMany
    @JoinTable(
        name = `"scholarship_programs`",
        joinColumns = @JoinColumn(name = `"scholarship_id`"),
        inverseJoinColumns = @JoinColumn(name = `"program_id`")
    )
    private List<Program> eligiblePrograms;
}
"@

    "EducationLoan" = @"
package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = `"education_loans`")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EducationLoan extends BaseEntity {
    @Column(nullable = false)
    private String lenderName;

    private BigDecimal maxLoanAmount;
    private Double interestRate;
    private String interestType; // FIXED, FLOATING
    private Integer maxTenureMonths;
    private Integer moratoriumMonths;
    private BigDecimal processingFee;
    private Boolean collateralRequired;
}
"@

    "SimulationScenario" = @"
package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = `"simulation_scenarios`")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SimulationScenario extends BaseEntity {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = `"student_profile_id`", nullable = false)
    private StudentProfile studentProfile;
    
    private String scenarioName;
    
    @Column(columnDefinition = `"text`")
    private String parametersJson;
    
    @OneToOne(mappedBy = `"scenario`", cascade = CascadeType.ALL)
    private SimulationResult result;
}
"@

    "SimulationResult" = @"
package com.careerpaths.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = `"simulation_results`")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SimulationResult extends BaseEntity {
    @OneToOne
    @JoinColumn(name = `"scenario_id`", nullable = false)
    private SimulationScenario scenario;
    
    @Column(columnDefinition = `"text`")
    private String resultDataJson;
}
"@

}

foreach ($key in $entities.Keys) {
    Set-Content -Path "$dir\$key.java" -Value $entities[$key]
}
