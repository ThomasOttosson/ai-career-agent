package backend.service;

import backend.model.CoverLetter;
import backend.model.JobPosting;
import backend.model.UserAccount;
import backend.model.UserProfile;
import backend.repository.CoverLetterRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoverLetterService {

    private final UserProfileService userProfileService;
    private final JobPostingService jobPostingService;
    private final UserAccountService userAccountService;
    private final CoverLetterRepository coverLetterRepository;
    private final OpenAiService openAiService;

    public CoverLetterService(
            UserProfileService userProfileService,
            JobPostingService jobPostingService,
            UserAccountService userAccountService,
            CoverLetterRepository coverLetterRepository,
            OpenAiService openAiService
    ) {
        this.userProfileService = userProfileService;
        this.jobPostingService = jobPostingService;
        this.userAccountService = userAccountService;
        this.coverLetterRepository = coverLetterRepository;
        this.openAiService = openAiService;
    }

    public CoverLetter generate(String userId, String jobId, String tone) {
        UserAccount currentUser = userAccountService.requireUser(userId);
        UserProfile profile = userProfileService.requireProfile(userId);
        JobPosting job = jobPostingService.getJobById(currentUser, jobId);

        String prompt = """
                Write a professional, concise cover letter.

                Tone: %s

                Candidate:
                Name: %s
                Current title: %s
                Experience level: %s
                Skills: %s
                Preferred role: %s
                Work mode preference: %s

                Job:
                Title: %s
                Company: %s
                Location: %s
                Work mode: %s
                Description: %s

                Requirements:
                - Keep it under 250 words
                - Make it specific to the job
                - Do not invent experience
                - Use a confident but natural tone
                - End with a professional sign-off
                """.formatted(
                tone,
                profile.getFullName(),
                profile.getCurrentTitle(),
                profile.getExperienceLevel(),
                String.join(", ", profile.getSkills()),
                profile.getPreferredRole(),
                profile.getWorkMode(),
                job.getTitle(),
                job.getCompany(),
                job.getLocation(),
                job.getWorkMode(),
                job.getDescription()
        );

        String letter = openAiService.generateText(prompt);

        CoverLetter coverLetter = new CoverLetter(currentUser, job, letter);
        coverLetter.setTitle(job.getTitle());
        coverLetter.setCompany(job.getCompany());

        return coverLetterRepository.save(coverLetter);
    }

    public List<CoverLetter> getAll(String userId) {
        UserAccount user = userAccountService.requireUser(userId);
        return coverLetterRepository.findAllByUserOrderByCreatedAtDesc(user);
    }

    public CoverLetter createManual(String userId, String title, String company, String content) {
        UserAccount user = userAccountService.requireUser(userId);
        CoverLetter coverLetter = new CoverLetter(user, title, company, content);
        return coverLetterRepository.save(coverLetter);
    }

    public CoverLetter update(
            String userId,
            String coverLetterId,
            String title,
            String company,
            String content
    ) {
        UserAccount user = userAccountService.requireUser(userId);
        CoverLetter coverLetter = coverLetterRepository.findByIdAndUser(coverLetterId, user)
                .orElseThrow(() -> new RuntimeException("Cover letter not found"));

        coverLetter.setTitle(title);
        coverLetter.setCompany(company);
        coverLetter.setContent(content);

        return coverLetterRepository.save(coverLetter);
    }

    public CoverLetter getLatestForJob(String userId, String jobId) {
        UserAccount user = userAccountService.requireUser(userId);
        JobPosting job = jobPostingService.getJobById(user, jobId);
        return coverLetterRepository.findTopByJobAndUserOrderByCreatedAtDesc(job, user)
                .orElse(null);
    }

    public void delete(String userId, String coverLetterId) {
        UserAccount user = userAccountService.requireUser(userId);
        CoverLetter coverLetter = coverLetterRepository.findByIdAndUser(coverLetterId, user)
                .orElseThrow(() -> new RuntimeException("Cover letter not found"));
        coverLetterRepository.delete(coverLetter);
    }

    public String rewriteWithAi(String content, String action) {
        String instruction = switch (action) {
            case "IMPROVE" -> "Improve the writing while keeping the meaning.";
            case "PROFESSIONAL" -> "Rewrite this cover letter in a more professional tone.";
            case "FRIENDLY" -> "Rewrite this cover letter in a warmer and more friendly tone.";
            case "SHORTER" -> "Make this cover letter shorter and more concise.";
            case "LONGER" -> "Make this cover letter slightly longer with stronger details.";
            case "GRAMMAR" -> "Fix grammar, spelling and sentence flow without changing the meaning.";
            default -> "Improve this cover letter.";
        };

        String prompt = """
                You are an expert career assistant.

                Task:
                %s

                Rules:
                - Keep it as a cover letter
                - Do not invent experience
                - Keep the same core meaning
                - Return only the rewritten cover letter text
                - Do not add explanations

                Cover letter:
                %s
                """.formatted(instruction, content);

        return openAiService.generateText(prompt);
    }
}
