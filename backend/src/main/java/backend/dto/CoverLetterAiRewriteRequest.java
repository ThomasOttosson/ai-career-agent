package backend.dto;

public record CoverLetterAiRewriteRequest(
        String content,
        String action
) {
}