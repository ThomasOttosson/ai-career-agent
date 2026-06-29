package backend.dto;

import java.time.LocalDate;

public record ApplicationCaseUpdateRequest(
        String status,
        String notes,
        LocalDate followUpDate
) {
}