package com.careerpaths.dto.assessment;
import lombok.Data;
import java.util.List;
@Data
public class StructuredProfileDto {
    private List<String> academicStrengths;
    private List<String> aptitudeStrengths;
    private List<String> interests;
    private List<String> financialConstraints;
    private List<String> locationPreferences;
}
