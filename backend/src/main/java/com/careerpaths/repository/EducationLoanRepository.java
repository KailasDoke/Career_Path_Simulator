package com.careerpaths.repository;

import com.careerpaths.entity.EducationLoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EducationLoanRepository extends JpaRepository<EducationLoan, Long> {
}
