package backend.dto;

public record AuthResponse(
        String userId,
        String email,
        String message
) {
}