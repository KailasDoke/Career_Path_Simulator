$baseDir = "C:\Users\kaila\Downloads\Career\career-path-simulator\backend\src\main\java\com\careerpaths"

New-Item -ItemType Directory -Force -Path "$baseDir\dto\student"

$dtoCode = @"
package com.careerpaths.dto.student;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class StudentProfileDto {
    private Long id;

    @NotBlank(message = `"First name is required`")
    private String firstName;

    @NotBlank(message = `"Last name is required`")
    private String lastName;

    private String currentEducationLevel;
    private String country;
    private String stateRegion;
    private String city;
    
    private AcademicRecordDto academicRecord;
    private FinancialProfileDto financialProfile;
    private LocationPreferenceDto locationPreference;
    private InterestProfileDto interestProfile;
}

@Data
class AcademicRecordDto {
    @Min(value = 0, message = `"Percentage cannot be less than 0`")
    @Max(value = 100, message = `"Percentage cannot be greater than 100`")
    private Double class10Percentage;
    
    private Map<String, Double> subjectMarks;
    private String academicStrengths;
}

@Data
class FinancialProfileDto {
    @Min(value = 0, message = `"Budget cannot be negative`")
    private BigDecimal annualEducationBudget;
    
    @Min(value = 0, message = `"Budget cannot be negative`")
    private BigDecimal maximumTotalBudget;
    
    @Min(value = 0, message = `"Contribution cannot be negative`")
    private BigDecimal familyContribution;
    
    private Boolean requiresScholarship;
    private Boolean willingToTakeLoan;
    
    @Min(value = 0, message = `"EMI cannot be negative`")
    private BigDecimal maximumComfortableEmi;
}

@Data
class LocationPreferenceDto {
    private List<String> preferredCountries;
    private List<String> preferredRegions;
    private String preferredCityType;
    private Boolean willingToStudyAbroad;
    private String distancePreference;
}

@Data
class InterestProfileDto {
    private List<String> primaryInterests;
}
"@

Set-Content -Path "$baseDir\dto\student\StudentProfileDto.java" -Value $dtoCode


$serviceCode = @"
package com.careerpaths.service;

import com.careerpaths.dto.student.StudentProfileDto;
import com.careerpaths.entity.*;
import com.careerpaths.repository.StudentProfileRepository;
import com.careerpaths.repository.UserRepository;
import com.careerpaths.exception.ResourceNotFoundException;
import com.careerpaths.exception.ValidationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StudentProfileService {

    private final StudentProfileRepository profileRepository;
    private final UserRepository userRepository;

    public StudentProfileService(StudentProfileRepository profileRepository, UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public StudentProfileDto createProfile(StudentProfileDto dto) {
        // Mock user binding since auth is not fully implemented
        User user = userRepository.findById(1L).orElseGet(() -> {
            User newUser = User.builder().email(`"test@example.com`").passwordHash(`"hash`").build();
            return userRepository.save(newUser);
        });

        StudentProfile profile = StudentProfile.builder()
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .user(user)
                .build();
        
        // Setup empty records to avoid nulls
        profile.setAcademicRecord(AcademicRecord.builder().studentProfile(profile).build());
        profile.setFinancialProfile(FinancialProfile.builder().studentProfile(profile).build());
        profile.setLocationPreference(LocationPreference.builder().studentProfile(profile).build());
        profile.setInterestProfile(InterestProfile.builder().studentProfile(profile).build());

        StudentProfile saved = profileRepository.save(profile);
        dto.setId(saved.getId());
        return dto;
    }

    @Transactional(readOnly = true)
    public StudentProfileDto getProfile(Long id) {
        StudentProfile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(`"Profile not found with id: `" + id));
        
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(profile.getId());
        dto.setFirstName(profile.getFirstName());
        dto.setLastName(profile.getLastName());
        return dto;
    }

    @Transactional
    public StudentProfileDto updateProfile(Long id, StudentProfileDto dto) {
        StudentProfile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(`"Profile not found with id: `" + id));
        
        // Update fields...
        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());

        if (dto.getFinancialProfile() != null && dto.getFinancialProfile().getAnnualEducationBudget() != null) {
            if (dto.getFinancialProfile().getMaximumTotalBudget() != null &&
                dto.getFinancialProfile().getAnnualEducationBudget().compareTo(dto.getFinancialProfile().getMaximumTotalBudget()) > 0) {
                throw new ValidationException(`"Annual budget cannot exceed maximum total budget`");
            }
        }
        
        profileRepository.save(profile);
        return dto;
    }
}
"@

Set-Content -Path "$baseDir\service\StudentProfileService.java" -Value $serviceCode

$controllerCode = @"
package com.careerpaths.controller;

import com.careerpaths.dto.student.StudentProfileDto;
import com.careerpaths.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(`"/api/students`")
@CrossOrigin(origins = `"*`")
public class StudentProfileController {

    private final StudentProfileService profileService;

    public StudentProfileController(StudentProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping
    public ResponseEntity<StudentProfileDto> createProfile(@Valid @RequestBody StudentProfileDto dto) {
        return new ResponseEntity<>(profileService.createProfile(dto), HttpStatus.CREATED);
    }

    @GetMapping(`"/{id}`")
    public ResponseEntity<StudentProfileDto> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getProfile(id));
    }

    @GetMapping(`"/{id}/profile`")
    public ResponseEntity<StudentProfileDto> getFullProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getProfile(id));
    }

    @PutMapping(`"/{id}`")
    public ResponseEntity<StudentProfileDto> updateProfile(@PathVariable Long id, @Valid @RequestBody StudentProfileDto dto) {
        return ResponseEntity.ok(profileService.updateProfile(id, dto));
    }
}
"@

Set-Content -Path "$baseDir\controller\StudentProfileController.java" -Value $controllerCode

