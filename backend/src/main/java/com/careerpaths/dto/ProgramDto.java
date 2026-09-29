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
