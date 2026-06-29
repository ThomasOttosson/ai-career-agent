package backend.dto;

public record JobPostingRequest(
        String title,
        String company,
        String location,
        String workMode,
        String description
) {
}