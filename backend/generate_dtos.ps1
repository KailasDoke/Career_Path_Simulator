$dtoDir = "C:\Users\kaila\Downloads\Career\career-path-simulator\backend\src\main\java\com\careerpaths\dto"

$dtos = @{
    "InstitutionDto" = @"
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
"@

    "ProgramDto" = @"
package com.careerpaths.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProgramDto {
    private Long id;
    private String name;
    private String institutionName;
    private String educationLevel;
    private Double durationYears;
    private BigDecimal totalTuition;
}
"@
}

foreach ($key in $dtos.Keys) {
    Set-Content -Path "$dtoDir\$key.java" -Value $dtos[$key]
}
