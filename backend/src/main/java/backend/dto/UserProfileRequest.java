package backend.dto;

import java.util.List;

public record UserProfileRequest(
        String fullName,
        String currentTitle,
        String experienceLevel,
        List<String> skills,
        String preferredRole,
        String workMode,
        String desiredSalary
) {
}