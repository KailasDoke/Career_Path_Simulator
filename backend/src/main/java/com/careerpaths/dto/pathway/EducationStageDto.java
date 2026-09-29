package com.careerpaths.dto.pathway;

import lombok.Data;
import java.util.List;

@Data
public class EducationStageDto {
    private String stageName;
    private String programName;
    private String degree;
    private String institutionName;
    private String country;
    private Double durationYears;
    private Double tuitionCost;
}
