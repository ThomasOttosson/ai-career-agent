package backend.dto;

public record CoverLetterUpdateRequest(
        String title,
        String company,
        String content
) {
}