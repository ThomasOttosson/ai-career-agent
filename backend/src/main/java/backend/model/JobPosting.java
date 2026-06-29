package backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class JobPosting {

    @Id
    private String id;

    private String userId;
    private String title;
    private String company;
    private String location;
    private String workMode;

    @Lob
    private String description;

    private LocalDateTime createdAt;

    public JobPosting() {
    }

    public JobPosting(String userId, String title, String company, String location, String workMode, String description) {
        this.id = UUID.randomUUID().toString();
        this.userId = userId;
        this.title = title;
        this.company = company;
        this.location = location;
        this.workMode = workMode;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getTitle() { return title; }
    public String getCompany() { return company; }
    public String getLocation() { return location; }
    public String getWorkMode() { return workMode; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setUserId(String userId) { this.userId = userId; }
}
