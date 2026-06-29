package backend.service;

import backend.dto.ApplicationCaseUpdateRequest;
import backend.model.ApplicationCase;
import backend.model.ApplicationStatus;
import backend.repository.ApplicationCaseRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplicationCaseService {

    private final ApplicationCaseRepository applicationCaseRepository;
    private final JobPostingService jobPostingService;

    public ApplicationCaseService(
            ApplicationCaseRepository applicationCaseRepository,
            JobPostingService jobPostingService
    ) {
        this.applicationCaseRepository = applicationCaseRepository;
        this.jobPostingService = jobPostingService;
    }

    public ApplicationCase createCase(String userId, String jobId) {
        jobPostingService.getJobById(userId, jobId);

        ApplicationCase applicationCase = new ApplicationCase(userId, jobId);
        return applicationCaseRepository.save(applicationCase);
    }

    public List<ApplicationCase> getCases(String userId) {
        return applicationCaseRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
    }

    public ApplicationCase approveCase(String userId, String caseId) {
        ApplicationCase applicationCase = findCase(userId, caseId);
        applicationCase.setStatus(ApplicationStatus.APPROVED);
        applicationCase.setApprovedAt(LocalDateTime.now());
        return applicationCaseRepository.save(applicationCase);
    }

    public ApplicationCase markReadyToApply(String userId, String caseId) {
        ApplicationCase applicationCase = findCase(userId, caseId);
        applicationCase.setStatus(ApplicationStatus.READY_TO_APPLY);
        return applicationCaseRepository.save(applicationCase);
    }

    public ApplicationCase markApplied(String userId, String caseId) {
        ApplicationCase applicationCase = findCase(userId, caseId);
        applicationCase.setStatus(ApplicationStatus.APPLIED);
        applicationCase.setAppliedAt(LocalDateTime.now());
        return applicationCaseRepository.save(applicationCase);
    }

    public ApplicationCase markInterview(String userId, String caseId) {
        ApplicationCase applicationCase = findCase(userId, caseId);
        applicationCase.setStatus(ApplicationStatus.INTERVIEW);
        applicationCase.setInterviewAt(LocalDateTime.now());
        return applicationCaseRepository.save(applicationCase);
    }

    public ApplicationCase markOffer(String userId, String caseId) {
        ApplicationCase applicationCase = findCase(userId, caseId);
        applicationCase.setStatus(ApplicationStatus.OFFER);
        applicationCase.setOfferAt(LocalDateTime.now());
        return applicationCaseRepository.save(applicationCase);
    }

    public ApplicationCase markHired(String userId, String caseId) {
        ApplicationCase applicationCase = findCase(userId, caseId);
        applicationCase.setStatus(ApplicationStatus.HIRED);
        applicationCase.setHiredAt(LocalDateTime.now());
        return applicationCaseRepository.save(applicationCase);
    }

    public ApplicationCase markRejected(String userId, String caseId) {
        ApplicationCase applicationCase = findCase(userId, caseId);
        applicationCase.setStatus(ApplicationStatus.REJECTED);
        applicationCase.setRejectedAt(LocalDateTime.now());
        return applicationCaseRepository.save(applicationCase);
    }

    public ApplicationCase updateCase(String userId, String caseId, ApplicationCaseUpdateRequest request) {
        ApplicationCase applicationCase = findCase(userId, caseId);

        if (request.status() != null && !request.status().isBlank()) {
            applicationCase.setStatus(ApplicationStatus.valueOf(request.status()));
        }

        applicationCase.setNotes(request.notes());
        applicationCase.setFollowUpDate(request.followUpDate());

        return applicationCaseRepository.save(applicationCase);
    }

    public void deleteCase(String userId, String caseId) {
        ApplicationCase applicationCase = findCase(userId, caseId);
        applicationCaseRepository.delete(applicationCase);
    }

    private ApplicationCase findCase(String userId, String caseId) {
        return applicationCaseRepository.findByIdAndUserId(caseId, userId)
                .orElseThrow(() -> new RuntimeException("Application case not found"));
    }
}
