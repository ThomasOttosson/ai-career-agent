package backend.controller;

import backend.dto.ResumeAiRewriteRequest;
import backend.service.ResumeService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resume")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/ai-rewrite")
    public String rewriteResume(@RequestBody ResumeAiRewriteRequest request) {
        return resumeService.rewriteResume(
                request.resume(),
                request.action()
        );
    }
}