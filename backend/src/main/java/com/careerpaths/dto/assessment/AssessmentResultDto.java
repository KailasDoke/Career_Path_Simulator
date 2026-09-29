package com.careerpaths.dto.assessment;
import lombok.Data;
import java.util.Map;
@Data
public class AssessmentResultDto {
    private Map<String, Integer> aptitudeScores;
    private Map<String, Integer> interestScores;
    private StructuredProfileDto structuredProfile;
}
