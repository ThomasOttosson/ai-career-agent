package backend.controller;

import backend.dto.ApplicationCaseUpdateRequest;
import backend.model.ApplicationCase;
import backend.service.ApplicationCaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationCaseController {

    private final ApplicationCaseService applicationCaseService;

    public ApplicationCaseController(ApplicationCaseService applicationCaseService) {
        this.applicationCaseService = applicationCaseService;
    }

    @PostMapping
    public ApplicationCase createCase(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody Map<String, String> body
    ) {
        return applicationCaseService.createCase(userId, body.get("jobId"));
    }

    @GetMapping
    public List<ApplicationCase> getCases(@RequestHeader("X-User-Id") String userId) {
        return applicationCaseService.getCases(userId);
    }

    @PostMapping("/{caseId}/approve")
    public ApplicationCase approveCase(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String caseId
    ) {
        return applicationCaseService.approveCase(userId, caseId);
    }

    @PostMapping("/{caseId}/ready")
    public ApplicationCase markReadyToApply(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String caseId
    ) {
        return applicationCaseService.markReadyToApply(userId, caseId);
    }

    @PutMapping("/{caseId}/applied")
    public ApplicationCase markApplied(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String caseId
    ) {
        return applicationCaseService.markApplied(userId, caseId);
    }

    @PutMapping("/{caseId}/interview")
    public ApplicationCase markInterview(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String caseId
    ) {
        return applicationCaseService.markInterview(userId, caseId);
    }

    @PutMapping("/{caseId}/offer")
    public ApplicationCase markOffer(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String caseId
    ) {
        return applicationCaseService.markOffer(userId, caseId);
    }

    @PutMapping("/{caseId}/hired")
    public ApplicationCase markHired(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String caseId
    ) {
        return applicationCaseService.markHired(userId, caseId);
    }

    @PutMapping("/{caseId}/rejected")
    public ApplicationCase markRejected(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String caseId
    ) {
        return applicationCaseService.markRejected(userId, caseId);
    }

    @DeleteMapping("/{caseId}")
    public void deleteCase(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String caseId
    ) {
        applicationCaseService.deleteCase(userId, caseId);
    }

    @PutMapping("/{caseId}")
    public ApplicationCase updateCase(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String caseId,
            @RequestBody ApplicationCaseUpdateRequest request
    ) {
        return applicationCaseService.updateCase(userId, caseId, request);
    }
}
