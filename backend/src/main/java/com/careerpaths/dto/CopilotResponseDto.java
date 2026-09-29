package com.careerpaths.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CopilotResponseDto {
    private String answer;
    private String why;
    private String evidence;
    private String assumptions;
    private String uncertainty;
    private String nextStep;
}
