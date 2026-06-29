package backend.controller;

import backend.dto.CoverLetterAiRewriteRequest;
import backend.dto.CoverLetterCreateRequest;
import backend.dto.CoverLetterGenerateRequest;
import backend.dto.CoverLetterUpdateRequest;
import backend.model.CoverLetter;
import backend.service.CoverLetterService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class CoverLetterController {

    private final CoverLetterService coverLetterService;

    public CoverLetterController(CoverLetterService coverLetterService) {
        this.coverLetterService = coverLetterService;
    }

    @PostMapping("/{jobId}/cover-letter")
    public CoverLetter generate(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String jobId,
            @RequestBody CoverLetterGenerateRequest request
    ) {
        return coverLetterService.generate(userId, jobId, request.tone());
    }

    @GetMapping("/{jobId}/cover-letter")
    public CoverLetter getLatestCoverLetter(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String jobId
    ) {
        return coverLetterService.getLatestForJob(userId, jobId);
    }

    @GetMapping("/cover-letters")
    public List<CoverLetter> getAllCoverLetters(@RequestHeader("X-User-Id") String userId) {
        return coverLetterService.getAll(userId);
    }

    @PostMapping("/cover-letters")
    public CoverLetter createManual(
            @RequestHeader("X-User-Id") String userId,
            @RequestBody CoverLetterCreateRequest request
    ) {
        return coverLetterService.createManual(
                userId,
                request.title(),
                request.company(),
                request.content()
        );
    }

    @PutMapping("/cover-letters/{coverLetterId}")
    public CoverLetter update(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String coverLetterId,
            @RequestBody CoverLetterUpdateRequest request
    ) {
        return coverLetterService.update(
                userId,
                coverLetterId,
                request.title(),
                request.company(),
                request.content()
        );
    }

    @PostMapping("/cover-letters/ai-rewrite")
    public String rewriteWithAi(@RequestBody CoverLetterAiRewriteRequest request) {
        return coverLetterService.rewriteWithAi(
                request.content(),
                request.action()
        );
    }

    @DeleteMapping("/cover-letters/{coverLetterId}")
    public void delete(
            @RequestHeader("X-User-Id") String userId,
            @PathVariable String coverLetterId
    ) {
        coverLetterService.delete(userId, coverLetterId);
    }
}
