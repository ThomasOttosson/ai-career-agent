package backend.controller;

import backend.model.JobMatchResult;
import backend.service.JobMatchService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobMatchController {

    private final JobMatchService jobMatchService;

    public JobMatchController(JobMatchService jobMatchService) {
        this.jobMatchService = jobMatchService;
    }

    @PostMapping("/{jobId}/analyze")
    public JobMatchResult analyzeJob(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String jobId
    ) {
        return jobMatchService.analyzeJob(userId, jobId);
    }
}
