package com.careerpaths.controller;

import com.careerpaths.dto.student.StudentProfileDto;
import com.careerpaths.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentProfileController {

    private final StudentProfileService profileService;

    public StudentProfileController(StudentProfileService profileService) {
        this.profileService = profileService;
    }

    @PostMapping
    public ResponseEntity<StudentProfileDto> createProfile(@Valid @RequestBody StudentProfileDto dto) {
        return new ResponseEntity<>(profileService.createProfile(dto), HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentProfileDto> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getProfile(id));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<StudentProfileDto> getFullProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getProfile(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StudentProfileDto> updateProfile(@PathVariable Long id, @Valid @RequestBody StudentProfileDto dto) {
        return ResponseEntity.ok(profileService.updateProfile(id, dto));
    }
}
