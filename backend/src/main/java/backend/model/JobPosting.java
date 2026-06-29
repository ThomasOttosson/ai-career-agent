package backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
public class JobPosting {

    @Id
    private String id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user;

    private String title;
    private String company;
    private String location;
    private String workMode;

    @Column(name = "description_text", columnDefinition = "TEXT")
    private String description;

    private LocalDateTime createdAt;

    public JobPosting() {
    }

    public JobPosting(UserAccount user, String title, String company, String location, String workMode, String description) {
        this.id = UUID.randomUUID().toString();
        this.user = user;
        this.title = title;
        this.company = company;
        this.location = location;
        this.workMode = workMode;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public UserAccount getUser() { return user; }
    public String getUserId() { return user != null ? user.getId() : null; }
    public String getTitle() { return title; }
    public String getCompany() { return company; }
    public String getLocation() { return location; }
    public String getWorkMode() { return workMode; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(String id) { this.id = id; }
    public void setUser(UserAccount user) { this.user = user; }
    public void setTitle(String title) { this.title = title; }
    public void setCompany(String company) { this.company = company; }
    public void setLocation(String location) { this.location = location; }
    public void setWorkMode(String workMode) { this.workMode = workMode; }
    public void setDescription(String description) { this.description = description; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
