package com.careerpaths.dto.pathway;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PathwayExplanationDto {
    private String academicExplanation;
    private String interestExplanation;
    private String financialExplanation;
    private String admissionExplanation;
    private String locationExplanation;
}
