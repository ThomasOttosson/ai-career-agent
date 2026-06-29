package backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class ApplicationCase {

    @Id
    private String id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private JobPosting job;

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

    public ApplicationCase(UserAccount user, JobPosting job) {
        this.id = UUID.randomUUID().toString();
        this.user = user;
        this.job = job;
        this.status = ApplicationStatus.NEW;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public UserAccount getUser() { return user; }
    public String getUserId() { return user != null ? user.getId() : null; }
    public JobPosting getJob() { return job; }
    public String getJobId() { return job != null ? job.getId() : null; }
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

    public void setId(String id) { this.id = id; }
    public void setUser(UserAccount user) { this.user = user; }
    public void setJob(JobPosting job) { this.job = job; }
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
