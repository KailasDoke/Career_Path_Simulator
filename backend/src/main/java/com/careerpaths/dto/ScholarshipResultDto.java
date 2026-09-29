package com.careerpaths.dto;

import lombok.Data;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ScholarshipResultDto {
    private String name;
    private String provider;
    private String matchStatus; // "Eligible", "Potentially eligible", "Missing information", "Not eligible"
    private String matchExplanation;
    private BigDecimal estimatedBenefit;
    private String eligibilityCriteria;
    private String requiredDocuments;
    private String applicationInformation;
    private String source;
    private String lastUpdated;
}
