package backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class ApplicationCase {

    @Id
    private String id;

    private String userId;
    private String jobId;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;
    private LocalDateTime appliedAt;
    private LocalDateTime interviewAt;
    private LocalDateTime offerAt;
    private LocalDateTime hiredAt;
    private LocalDateTime rejectedAt;
    private String notes;
    private LocalDate followUpDate;

    public ApplicationCase() {
    }

    public ApplicationCase(String userId, String jobId) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.jobId = jobId;
        this.status = ApplicationStatus.NEW;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getJobId() { return jobId; }
    public ApplicationStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getApprovedAt() { return approvedAt; }
    public LocalDateTime getAppliedAt() { return appliedAt; }
    public LocalDateTime getInterviewAt() { return interviewAt; }
    public LocalDateTime getOfferAt() { return offerAt; }
    public LocalDateTime getHiredAt() { return hiredAt; }
    public LocalDateTime getRejectedAt() { return rejectedAt; }
    public String getNotes() { return notes; }
    public LocalDate getFollowUpDate() { return followUpDate; }

    public void setUserId(String userId) { this.userId = userId; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }
    public void setInterviewAt(LocalDateTime interviewAt) { this.interviewAt = interviewAt; }
    public void setOfferAt(LocalDateTime offerAt) { this.offerAt = offerAt; }
    public void setHiredAt(LocalDateTime hiredAt) { this.hiredAt = hiredAt; }
    public void setRejectedAt(LocalDateTime rejectedAt) { this.rejectedAt = rejectedAt; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setFollowUpDate(LocalDate followUpDate) { this.followUpDate = followUpDate; }
}
