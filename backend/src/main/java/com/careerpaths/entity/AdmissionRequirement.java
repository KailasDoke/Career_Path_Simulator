package com.careerpaths.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdmissionRequirement {
    private String field;
    private String operator;
    @jakarta.persistence.Column(name = "req_value")
    private String value;
}
