package backend.service;

import backend.dto.CareerCoachRequest;
import org.springframework.stereotype.Service;

@Service
public class CareerCoachService {

    private final OpenAiService openAiService;

    public CareerCoachService(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    public String askCoach(CareerCoachRequest request) {
        String prompt = """
                You are an expert AI career coach.

                Help the user with career planning, resumes, cover letters,
                job applications, interviews, salary negotiation, and job search strategy.

                Be practical, specific, and encouraging.
                Do not invent facts.
                If information is missing, say what the user should add.

                User profile:
                %s

                Resume:
                %s

                Saved jobs:
                %s

                Applications:
                %s

                User question:
                %s
                """.formatted(
                request.profileContext(),
                request.resumeContext(),
                request.jobsContext(),
                request.applicationsContext(),
                request.message()
        );

        return openAiService.generateText(prompt);
    }
}