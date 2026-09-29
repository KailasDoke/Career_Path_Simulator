package com.careerpaths.controller;

import com.careerpaths.entity.*;
import com.careerpaths.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class KnowledgeBaseController {

    private final CountryRepository countryRepository;
    private final InstitutionRepository institutionRepository;
    private final ProgramRepository programRepository;
    private final CareerRepository careerRepository;

    public KnowledgeBaseController(CountryRepository countryRepository, InstitutionRepository institutionRepository, ProgramRepository programRepository, CareerRepository careerRepository) {
        this.countryRepository = countryRepository;
        this.institutionRepository = institutionRepository;
        this.programRepository = programRepository;
        this.careerRepository = careerRepository;
    }

    @GetMapping("/countries")
    public ResponseEntity<List<Country>> getCountries() {
        return ResponseEntity.ok(countryRepository.findAll());
    }

    @GetMapping("/institutions")
    public ResponseEntity<List<Institution>> getInstitutions(
            @RequestParam(required = false) Long countryId) {
        if (countryId != null) {
            // Simplified for brevity. A proper JPA specification or custom query would be better.
            return ResponseEntity.ok(institutionRepository.findAll().stream()
                    .filter(i -> i.getCountry() != null && i.getCountry().getId().equals(countryId))
                    .toList());
        }
        return ResponseEntity.ok(institutionRepository.findAll());
    }

    @GetMapping("/programs")
    public ResponseEntity<List<Program>> getPrograms(
            @RequestParam(required = false) Long institutionId,
            @RequestParam(required = false) String degree) {
        List<Program> programs = programRepository.findAll();
        
        if (institutionId != null) {
            programs = programs.stream()
                    .filter(p -> p.getInstitution() != null && p.getInstitution().getId().equals(institutionId))
                    .toList();
        }
        
        if (degree != null && !degree.isEmpty()) {
            programs = programs.stream()
                    .filter(p -> degree.equalsIgnoreCase(p.getDegree()))
                    .toList();
        }
        
        return ResponseEntity.ok(programs);
    }

    @GetMapping("/programs/{id}")
    public ResponseEntity<Program> getProgram(@PathVariable Long id) {
        return programRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/careers")
    public ResponseEntity<List<Career>> getCareers() {
        return ResponseEntity.ok(careerRepository.findAll());
    }

    @GetMapping("/careers/{id}")
    public ResponseEntity<Career> getCareer(@PathVariable Long id) {
        return careerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
