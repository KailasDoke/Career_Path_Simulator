package com.careerpaths.entity;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;

@MappedSuperclass
@Getter
@Setter
public abstract class KnowledgeBaseEntity extends BaseEntity {
    private String source;
    private String sourceUrl;
    private String lastUpdated;
    
    @Column(columnDefinition = "text")
    private String notes;
    
    private String verificationStatus;
    
    @Column(nullable = false, columnDefinition = "varchar(255) default 'DEMO'")
    private String sourceType = "DEMO";
}
