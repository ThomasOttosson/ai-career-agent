package backend.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;

import java.util.ArrayList;
import java.util.List;

@Entity
public class UserProfile {

    @Id
    private String id;

    private String userId;
    private String fullName;
    private String currentTitle;
    private String experienceLevel;

    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> skills = new ArrayList<>();

    private String preferredRole;
    private String workMode;
    private String desiredSalary;

    public UserProfile() {
    }

    public UserProfile(
            String userId,
            String fullName,
            String currentTitle,
            String experienceLevel,
            List<String> skills,
            String preferredRole,
            String workMode,
            String desiredSalary
    ) {
        this.id = userId;
        this.userId = userId;
        this.fullName = fullName;
        this.currentTitle = currentTitle;
        this.experienceLevel = experienceLevel;
        this.skills = skills != null ? skills : new ArrayList<>();
        this.preferredRole = preferredRole;
        this.workMode = workMode;
        this.desiredSalary = desiredSalary;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getCurrentTitle() {
        return currentTitle;
    }

    public void setCurrentTitle(String currentTitle) {
        this.currentTitle = currentTitle;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills != null ? skills : new ArrayList<>();
    }

    public String getPreferredRole() {
        return preferredRole;
    }

    public void setPreferredRole(String preferredRole) {
        this.preferredRole = preferredRole;
    }

    public String getWorkMode() {
        return workMode;
    }

    public void setWorkMode(String workMode) {
        this.workMode = workMode;
    }

    public String getDesiredSalary() {
        return desiredSalary;
    }

    public void setDesiredSalary(String desiredSalary) {
        this.desiredSalary = desiredSalary;
    }
}
