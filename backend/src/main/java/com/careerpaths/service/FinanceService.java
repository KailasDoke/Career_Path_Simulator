package com.careerpaths.service;

import com.careerpaths.dto.LoanCalculationResultDto;
import com.careerpaths.dto.PathwayFundingDto;
import com.careerpaths.dto.ScholarshipResultDto;
import com.careerpaths.entity.EducationLoan;
import com.careerpaths.entity.FinancialProfile;
import com.careerpaths.entity.Scholarship;
import com.careerpaths.entity.StudentProfile;
import com.careerpaths.repository.EducationLoanRepository;
import com.careerpaths.repository.ScholarshipRepository;
import com.careerpaths.repository.StudentProfileRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class FinanceService {

    private final ScholarshipRepository scholarshipRepository;
    private final EducationLoanRepository loanRepository;
    private final StudentProfileRepository profileRepository;

    public FinanceService(ScholarshipRepository scholarshipRepository, 
                          EducationLoanRepository loanRepository,
                          StudentProfileRepository profileRepository) {
        this.scholarshipRepository = scholarshipRepository;
        this.loanRepository = loanRepository;
        this.profileRepository = profileRepository;
    }

    public List<ScholarshipResultDto> matchScholarships(Long studentId, String countryCode, String educationLevel) {
        StudentProfile profile = profileRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Scholarship> allScholarships = scholarshipRepository.findAll();
        List<ScholarshipResultDto> results = new ArrayList<>();

        for (Scholarship s : allScholarships) {
            String matchStatus = "Not eligible";
            String explanation = "Does not meet basic criteria.";

            boolean potential = false;
            boolean missingInfo = false;
            int criteriaPassed = 0;
            int criteriaChecked = 0;

            // Country check
            if (s.getTargetCountryCode() != null) {
                criteriaChecked++;
                if (s.getTargetCountryCode().equalsIgnoreCase(countryCode)) {
                    criteriaPassed++;
                } else {
                    continue; // Strict fail
                }
            }

            // Income check
            if (s.getMaxFamilyIncome() != null) {
                criteriaChecked++;
                if (profile.getFinancialProfile() != null && profile.getFinancialProfile().getMaximumTotalBudget() != null) {
                    // Using budget as a proxy for family contribution/income for now
                    if (profile.getFinancialProfile().getMaximumTotalBudget().compareTo(s.getMaxFamilyIncome()) <= 0) {
                        criteriaPassed++;
                    } else {
                        continue; // Strict fail
                    }
                } else {
                    missingInfo = true;
                }
            }

            // Academic check
            if (s.getMinGpa() != null) {
                criteriaChecked++;
                if (profile.getAcademicRecord() != null && profile.getAcademicRecord().getClass10Percentage() != null) {
                    if (profile.getAcademicRecord().getClass10Percentage() >= s.getMinGpa()) {
                        criteriaPassed++;
                    } else {
                        continue; // Strict fail
                    }
                } else {
                    missingInfo = true;
                }
            }

            if (missingInfo) {
                matchStatus = "Missing information";
                explanation = "Your profile is missing academic or financial data needed to determine eligibility.";
            } else if (criteriaPassed == criteriaChecked) {
                matchStatus = "Eligible";
                explanation = "You meet all known criteria for this scholarship.";
            } else {
                matchStatus = "Potentially eligible";
                explanation = "You meet some criteria but additional verification is required.";
            }

            results.add(ScholarshipResultDto.builder()
                .name(s.getName())
                .provider(s.getProvider())
                .matchStatus(matchStatus)
                .matchExplanation(explanation)
                .estimatedBenefit(s.getBenefitAmount())
                .eligibilityCriteria(s.getEligibilityCriteria())
                .requiredDocuments(s.getRequiredDocuments())
                .applicationInformation(s.getApplicationInformation())
                .source(s.getSource())
                .lastUpdated(s.getLastUpdated())
                .build());
        }

        return results;
    }

    public LoanCalculationResultDto calculateLoan(BigDecimal amount, Double annualInterestRate, Integer tenureMonths, Integer moratoriumMonths, BigDecimal processingFee) {
        // EMI = [P x R x (1+R)^N]/[(1+R)^N-1]
        // R = monthly interest rate (annual / 12 / 100)
        double r = (annualInterestRate / 12) / 100;
        double p = amount.doubleValue();
        int n = tenureMonths;

        double emi = 0.0;
        if (r > 0) {
            emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        } else {
            emi = p / n;
        }

        BigDecimal emiValue = BigDecimal.valueOf(emi).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalRepayment = emiValue.multiply(BigDecimal.valueOf(n));
        BigDecimal totalInterest = totalRepayment.subtract(amount);

        return LoanCalculationResultDto.builder()
            .lenderName("Custom Calculation")
            .loanAmount(amount)
            .interestRate(annualInterestRate)
            .tenureMonths(tenureMonths)
            .moratoriumMonths(moratoriumMonths)
            .processingFee(processingFee)
            .estimatedEmi(emiValue)
            .estimatedTotalInterest(totalInterest)
            .estimatedTotalRepayment(totalRepayment)
            .assumptions("Calculated using standard reducing balance method. Moratorium interest is assumed to be paid simple or capitalized (not detailed here).")
            .build();
    }

    public List<LoanCalculationResultDto> compareLoans(BigDecimal requiredAmount) {
        List<EducationLoan> loans = loanRepository.findAll();
        List<LoanCalculationResultDto> comparisons = new ArrayList<>();

        for (EducationLoan loan : loans) {
            // Cap at max loan amount
            BigDecimal actualAmount = requiredAmount;
            if (loan.getMaxLoanAmount() != null && actualAmount.compareTo(loan.getMaxLoanAmount()) > 0) {
                actualAmount = loan.getMaxLoanAmount();
            }

            LoanCalculationResultDto calc = calculateLoan(
                actualAmount,
                loan.getInterestRate(),
                loan.getMaxTenureMonths() != null ? loan.getMaxTenureMonths() : 120,
                loan.getMoratoriumMonths() != null ? loan.getMoratoriumMonths() : 0,
                loan.getProcessingFee() != null ? loan.getProcessingFee() : BigDecimal.ZERO
            );

            calc.setLenderName(loan.getLenderName());
            calc.setCollateralRequired(loan.getCollateralRequired());
            
            comparisons.add(calc);
        }
        return comparisons;
    }

    public PathwayFundingDto calculatePathwayFunding(String pathwayName, BigDecimal estimatedCost, Long studentId) {
        StudentProfile profile = profileRepository.findById(studentId)
            .orElseThrow(() -> new RuntimeException("Student not found"));
            
        BigDecimal familyContribution = BigDecimal.ZERO;
        if (profile.getFinancialProfile() != null && profile.getFinancialProfile().getMaximumTotalBudget() != null) {
            familyContribution = profile.getFinancialProfile().getMaximumTotalBudget();
        }

        // Estimate some average scholarship for demo
        BigDecimal scholarshipEstimate = BigDecimal.ZERO;
        List<ScholarshipResultDto> scholarships = matchScholarships(studentId, null, null);
        for (ScholarshipResultDto s : scholarships) {
            if ("Eligible".equals(s.getMatchStatus()) && s.getEstimatedBenefit() != null) {
                scholarshipEstimate = scholarshipEstimate.add(s.getEstimatedBenefit());
            }
        }

        BigDecimal gap = estimatedCost.subtract(familyContribution).subtract(scholarshipEstimate);
        if (gap.compareTo(BigDecimal.ZERO) < 0) {
            gap = BigDecimal.ZERO;
        }

        return PathwayFundingDto.builder()
            .pathwayName(pathwayName)
            .estimatedTotalCost(estimatedCost)
            .familyContribution(familyContribution)
            .scholarshipEstimate(scholarshipEstimate)
            .estimatedFundingGap(gap)
            .potentialLoanRequirement(gap)
            .isEstimate(true)
            .build();
    }
}
