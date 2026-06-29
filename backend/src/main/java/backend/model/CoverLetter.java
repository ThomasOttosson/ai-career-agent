package backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class CoverLetter {

    @Id
    private String id;

    private String userId;
    private String jobId;
    private String title;
    private String company;

    @Lob
    private String content;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CoverLetter() {
    }

    public CoverLetter(String userId, String jobId, String content) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.jobId = jobId;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public CoverLetter(String userId, String title, String company, String content) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.title = title;
        this.company = company;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getJobId() { return jobId; }
    public String getTitle() { return title; }
    public String getCompany() { return company; }
    public String getContent() { return content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setUserId(String userId) { this.userId = userId; }
    public void setJobId(String jobId) { this.jobId = jobId; }
    public void setTitle(String title) { this.title = title; }
    public void setCompany(String company) { this.company = company; }
    public void setContent(String content) {
        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }
}
