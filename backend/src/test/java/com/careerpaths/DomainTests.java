package com.careerpaths;

import com.careerpaths.entity.Country;
import com.careerpaths.entity.Institution;
import com.careerpaths.entity.enums.InstitutionType;
import com.careerpaths.repository.InstitutionRepository;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class DomainTests {

    @Autowired
    private InstitutionRepository institutionRepository;


    @Autowired
    private EntityManager entityManager;

    @Test
    public void testInstitutionPersistence() {
        Country country = Country.builder().name("UK").code("UK").build();
        entityManager.persist(country);

        Institution institution = Institution.builder()
                .name("Oxford")
                .country(country)
                .type(InstitutionType.PUBLIC_UNIVERSITY)
                .build();
        
        entityManager.persist(institution);
        entityManager.flush();

        Institution found = institutionRepository.findById(institution.getId()).orElse(null);
        assertThat(found).isNotNull();
        assertThat(found.getName()).isEqualTo("Oxford");
        assertThat(found.getCountry().getCode()).isEqualTo("UK");
    }
}
