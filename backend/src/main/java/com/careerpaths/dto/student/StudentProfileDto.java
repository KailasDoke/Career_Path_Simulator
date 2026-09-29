package com.careerpaths.dto.student;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class StudentProfileDto {
    private Long id;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String currentEducationLevel;
    private String country;
    private String stateRegion;
    private String city;
    
    private AcademicRecordDto academicRecord;
    private FinancialProfileDto financialProfile;
    private LocationPreferenceDto locationPreference;
    private InterestProfileDto interestProfile;
}
