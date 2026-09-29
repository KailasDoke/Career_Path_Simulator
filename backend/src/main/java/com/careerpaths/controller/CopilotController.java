package com.careerpaths.controller;

import com.careerpaths.dto.CopilotRequestDto;
import com.careerpaths.dto.CopilotResponseDto;
import com.careerpaths.service.CopilotService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/copilot")
public class CopilotController {

    private final CopilotService copilotService;

    public CopilotController(CopilotService copilotService) {
        this.copilotService = copilotService;
    }

    @PostMapping("/ask")
    public ResponseEntity<CopilotResponseDto> askCopilot(@RequestBody CopilotRequestDto request) {
        return ResponseEntity.ok(copilotService.ask(request));
    }
}
