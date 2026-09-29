package com.careerpaths.repository;

import com.careerpaths.entity.CareerPathway;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CareerPathwayRepository extends JpaRepository<CareerPathway, Long> {
}
