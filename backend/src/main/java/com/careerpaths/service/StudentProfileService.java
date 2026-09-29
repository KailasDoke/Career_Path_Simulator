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
            User newUser = User.builder().email("test@example.com").passwordHash("hash").build();
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
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
        
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(profile.getId());
        dto.setFirstName(profile.getFirstName());
        dto.setLastName(profile.getLastName());
        return dto;
    }

    @Transactional
    public StudentProfileDto updateProfile(Long id, StudentProfileDto dto) {
        StudentProfile profile = profileRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found with id: " + id));
        
        // Update fields...
        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());

        if (dto.getFinancialProfile() != null && dto.getFinancialProfile().getAnnualEducationBudget() != null) {
            if (dto.getFinancialProfile().getMaximumTotalBudget() != null &&
                dto.getFinancialProfile().getAnnualEducationBudget().compareTo(dto.getFinancialProfile().getMaximumTotalBudget()) > 0) {
                throw new ValidationException("Annual budget cannot exceed maximum total budget");
            }
        }
        
        profileRepository.save(profile);
        return dto;
    }
}
