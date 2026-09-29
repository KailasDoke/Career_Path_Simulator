package com.careerpaths.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class InstitutionDto {
    private Long id;
    private String name;
    private String countryName;
    private String city;
    private String type;
    private BigDecimal estimatedLivingCostAnnual;
}
