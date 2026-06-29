package backend.controller;

import backend.dto.JobPostingRequest;
import backend.model.JobPosting;
import backend.service.JobPostingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobPostingController {

    private final JobPostingService jobPostingService;

    public JobPostingController(JobPostingService jobPostingService) {
        this.jobPostingService = jobPostingService;
    }

    @PostMapping
    public JobPosting createJob(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody JobPostingRequest request
    ) {
        return jobPostingService.createJob(userId, request);
    }

    @GetMapping
    public List<JobPosting> getJobs(@RequestHeader("X-User-Id") String userId) {
        return jobPostingService.getJobs(userId);
    }
}
