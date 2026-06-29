package backend.dto;

public record CareerCoachRequest(
        String message,
        String profileContext,
        String resumeContext,
        String jobsContext,
        String applicationsContext
) {
}