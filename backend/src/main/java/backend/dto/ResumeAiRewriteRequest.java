package backend.dto;

public record ResumeAiRewriteRequest(
        String resume,
        String action
) {
}