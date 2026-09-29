package com.careerpaths.controller;

import com.careerpaths.dto.pathway.GeneratePathwayRequestDto;
import com.careerpaths.dto.pathway.PathwayDto;
import com.careerpaths.service.PathwayEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pathways")
@CrossOrigin(origins = "*")
public class PathwayController {

    private final PathwayEngineService pathwayEngineService;

    public PathwayController(PathwayEngineService pathwayEngineService) {
        this.pathwayEngineService = pathwayEngineService;
    }

    @PostMapping("/generate")
    public ResponseEntity<List<PathwayDto>> generatePathways(@RequestBody GeneratePathwayRequestDto request) {
        List<PathwayDto> pathways = pathwayEngineService.generatePathways(request.getStudentId());
        return ResponseEntity.ok(pathways);
    }
}
