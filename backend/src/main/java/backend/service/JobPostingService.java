package backend.service;

import backend.dto.JobPostingRequest;
import backend.model.JobPosting;
import backend.model.UserAccount;
import backend.repository.JobPostingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;
    private final UserAccountService userAccountService;

    public JobPostingService(
            JobPostingRepository jobPostingRepository,
            UserAccountService userAccountService
    ) {
        this.jobPostingRepository = jobPostingRepository;
        this.userAccountService = userAccountService;
    }

    public JobPosting createJob(String userId, JobPostingRequest request) {
        UserAccount user = userAccountService.requireUser(userId);

        JobPosting job = new JobPosting(
                user,
                request.title(),
                request.company(),
                request.location(),
                request.workMode(),
                request.description()
        );

        return jobPostingRepository.save(job);
    }

    public List<JobPosting> getJobs(String userId) {
        UserAccount user = userAccountService.requireUser(userId);
        return jobPostingRepository.findAllByUserOrderByCreatedAtDesc(user);
    }

    public JobPosting getJobById(String userId, String id) {
        UserAccount user = userAccountService.requireUser(userId);
        return getJobById(user, id);
    }

    public JobPosting getJobById(UserAccount user, String id) {
        return jobPostingRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }
}
