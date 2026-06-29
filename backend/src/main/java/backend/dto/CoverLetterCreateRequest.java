package backend.dto;

public record CoverLetterCreateRequest(
        String title,
        String company,
        String content
) {
}