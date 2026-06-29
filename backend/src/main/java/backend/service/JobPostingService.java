package backend.service;

import backend.dto.JobPostingRequest;
import backend.model.JobPosting;
import backend.repository.JobPostingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;

    public JobPostingService(JobPostingRepository jobPostingRepository) {
        this.jobPostingRepository = jobPostingRepository;
    }

    public JobPosting createJob(String userId, JobPostingRequest request) {
        JobPosting job = new JobPosting(
                userId,
                request.title(),
                request.company(),
                request.location(),
                request.workMode(),
                request.description()
        );

        return jobPostingRepository.save(job);
    }

    public List<JobPosting> getJobs(String userId) {
        return jobPostingRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
    }

    public JobPosting getJobById(String userId, String id) {
        return jobPostingRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }
}
