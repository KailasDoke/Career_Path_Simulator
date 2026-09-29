package com.careerpaths.dto.assessment;
import lombok.Data;
import java.util.Map;
@Data
public class AssessmentSubmissionDto {
    private Map<String, String> answers;
}
