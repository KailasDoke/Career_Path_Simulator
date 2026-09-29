package com.careerpaths.controller;

import com.careerpaths.dto.LoanCalculationResultDto;
import com.careerpaths.dto.PathwayFundingDto;
import com.careerpaths.dto.ScholarshipResultDto;
import com.careerpaths.service.FinanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @GetMapping("/scholarships/{studentId}")
    public ResponseEntity<List<ScholarshipResultDto>> getScholarships(
            @PathVariable Long studentId,
            @RequestParam(required = false) String countryCode,
            @RequestParam(required = false) String educationLevel) {
        return ResponseEntity.ok(financeService.matchScholarships(studentId, countryCode, educationLevel));
    }

    @PostMapping("/loans/calculate")
    public ResponseEntity<LoanCalculationResultDto> calculateLoan(@RequestBody Map<String, Object> request) {
        BigDecimal amount = new BigDecimal(request.get("amount").toString());
        Double interestRate = Double.valueOf(request.get("interestRate").toString());
        Integer tenureMonths = Integer.valueOf(request.get("tenureMonths").toString());
        
        Integer moratoriumMonths = request.containsKey("moratoriumMonths") ? 
            Integer.valueOf(request.get("moratoriumMonths").toString()) : 0;
            
        BigDecimal processingFee = request.containsKey("processingFee") ? 
            new BigDecimal(request.get("processingFee").toString()) : BigDecimal.ZERO;

        return ResponseEntity.ok(financeService.calculateLoan(amount, interestRate, tenureMonths, moratoriumMonths, processingFee));
    }

    @GetMapping("/loans/compare")
    public ResponseEntity<List<LoanCalculationResultDto>> compareLoans(@RequestParam BigDecimal amount) {
        return ResponseEntity.ok(financeService.compareLoans(amount));
    }

    @PostMapping("/pathway-funding/{studentId}")
    public ResponseEntity<PathwayFundingDto> calculatePathwayFunding(
            @PathVariable Long studentId,
            @RequestBody Map<String, Object> request) {
        String pathwayName = request.getOrDefault("pathwayName", "Custom Pathway").toString();
        BigDecimal estimatedCost = new BigDecimal(request.get("estimatedCost").toString());
        
        return ResponseEntity.ok(financeService.calculatePathwayFunding(pathwayName, estimatedCost, studentId));
    }
}
