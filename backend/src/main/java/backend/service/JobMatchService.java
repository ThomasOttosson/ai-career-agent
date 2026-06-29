package backend.service;

import backend.model.JobMatchResult;
import backend.model.JobPosting;
import backend.model.UserProfile;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class JobMatchService {

    private final UserProfileService userProfileService;
    private final JobPostingService jobPostingService;
    private final OpenAiService openAiService;

    public JobMatchService(
            UserProfileService userProfileService,
            JobPostingService jobPostingService,
            OpenAiService openAiService
    ) {
        this.userProfileService = userProfileService;
        this.jobPostingService = jobPostingService;
        this.openAiService = openAiService;
    }

    public JobMatchResult analyzeJob(String userId, String jobId) {
        UserProfile profile = userProfileService.requireProfile(userId);
        JobPosting job = jobPostingService.getJobById(userId, jobId);

        String description = job.getDescription().toLowerCase();

        List<String> matchedSkills = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();

        for (String skill : profile.getSkills()) {
            if (description.contains(skill.toLowerCase())) {
                matchedSkills.add(skill);
            } else {
                missingSkills.add(skill);
            }
        }

        int score = profile.getSkills().isEmpty()
                ? 0
                : (int) (((double) matchedSkills.size() / profile.getSkills().size()) * 100);

        String confidence;

        if (score >= 75) {
            confidence = "High";
        } else if (score >= 40) {
            confidence = "Medium";
        } else {
            confidence = "Low";
        }

        List<String> strengths = new ArrayList<>();
        List<String> risks = new ArrayList<>();

        if (!matchedSkills.isEmpty()) {
            strengths.add("Candidate has relevant skills: " + String.join(", ", matchedSkills));
        }

        if (job.getWorkMode().equalsIgnoreCase(profile.getWorkMode())) {
            strengths.add("Work mode matches candidate preference.");
        } else {
            risks.add("Work mode does not fully match candidate preference.");
        }

        if (!missingSkills.isEmpty()) {
            risks.add("Candidate may need to strengthen: " + String.join(", ", missingSkills));
        }

        String aiPrompt = """
                Analyze this job match.

                Candidate:
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

                Give a short professional evaluation.
                Explain:
                - Why the candidate fits
                - Potential weaknesses
                - Whether applying is recommended

                Keep the answer to 3-5 sentences.
                Do not invent experience.
                """.formatted(
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

        String aiRecommendation = openAiService.generateJobMatchAnalysis(aiPrompt);

        return new JobMatchResult(
                job.getId(),
                job.getTitle(),
                job.getCompany(),
                score,
                confidence,
                matchedSkills,
                missingSkills,
                strengths,
                risks,
                aiRecommendation
        );
    }
}
