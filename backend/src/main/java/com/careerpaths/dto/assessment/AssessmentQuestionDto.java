package com.careerpaths.dto.assessment;
import lombok.Data;
import java.util.List;
@Data
public class AssessmentQuestionDto {
    private String id;
    private String question;
    private List<String> options;
    private String category;
    private String type; // 'APTITUDE' or 'INTEREST'
    private String difficulty;
    
    public AssessmentQuestionDto() {}
    
    public AssessmentQuestionDto(String id, String question, List<String> options, String category, String type, String difficulty) {
        this.id = id;
        this.question = question;
        this.options = options;
        this.category = category;
        this.type = type;
        this.difficulty = difficulty;
    }
}
