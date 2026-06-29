package backend.service;

import org.springframework.stereotype.Service;

@Service
public class ResumeService {

    private final OpenAiService openAiService;

    public ResumeService(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    public String rewriteResume(String resume, String action) {
        String instruction = switch (action) {
            case "IMPROVE" -> "Improve this resume while keeping the same facts.";
            case "PROFESSIONAL" -> "Rewrite this resume in a more professional tone.";
            case "SHORTER" -> "Make this resume shorter and more concise.";
            case "LONGER" -> "Expand this resume with stronger detail, without inventing experience.";
            case "GRAMMAR" -> "Fix grammar, spelling, and sentence flow.";
            case "ATS" -> "Improve this resume for ATS systems using clear keywords and structure.";
            default -> "Improve this resume.";
        };

        String prompt = """
                You are an expert resume writer.

                Task:
                %s

                Rules:
                - Keep this as a resume
                - Do not invent experience
                - Keep the same facts
                - Improve clarity, structure, and impact
                - Return only the rewritten resume text
                - Do not add explanations

                Resume:
                %s
                """.formatted(instruction, resume);

        return openAiService.generateText(prompt);
    }
}