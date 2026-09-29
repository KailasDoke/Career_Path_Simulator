package com.careerpaths.dto.pathway;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FitScoreDto {
    private Integer academicFit;
    private Integer interestFit;
    private Integer financialFit;
    private Integer locationFit;
    private Integer admissionFit;
    private Integer overallFit; // Optional aggregated score
}
