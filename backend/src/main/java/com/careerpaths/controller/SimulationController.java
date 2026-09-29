package com.careerpaths.controller;

import com.careerpaths.dto.SimulationRequestDto;
import com.careerpaths.dto.SimulationResultDto;
import com.careerpaths.service.SimulationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/simulation")
public class SimulationController {

    private final SimulationService simulationService;

    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @PostMapping("/{studentId}")
    public ResponseEntity<SimulationResultDto> runSimulation(
            @PathVariable Long studentId,
            @RequestBody SimulationRequestDto request) {
        return ResponseEntity.ok(simulationService.runSimulation(studentId, request));
    }
}
