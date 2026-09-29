package com.careerpaths.dto.student;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.util.Map;

@Data
public class AcademicRecordDto {
    @Min(value = 0, message = "Percentage cannot be less than 0")
    @Max(value = 100, message = "Percentage cannot be greater than 100")
    private Double class10Percentage;
    
    private Map<String, Double> subjectMarks;
    private String academicStrengths;
}
