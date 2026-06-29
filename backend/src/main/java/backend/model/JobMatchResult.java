package backend.model;

import java.util.List;

public class JobMatchResult {
    private String jobId;
    private String jobTitle;
    private String company;
    private int score;
    private String confidence;
    private List<String> matchedSkills;
    private List<String> missingSkills;
    private List<String> strengths;
    private List<String> risks;
    private String recommendation;

    public JobMatchResult(
            String jobId,
            String jobTitle,
            String company,
            int score,
            String confidence,
            List<String> matchedSkills,
            List<String> missingSkills,
            List<String> strengths,
            List<String> risks,
            String recommendation
    ) {
        this.jobId = jobId;
        this.jobTitle = jobTitle;
        this.company = company;
        this.score = score;
        this.confidence = confidence;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
        this.strengths = strengths;
        this.risks = risks;
        this.recommendation = recommendation;
    }

    public String getJobId() { return jobId; }
    public String getJobTitle() { return jobTitle; }
    public String getCompany() { return company; }
    public int getScore() { return score; }
    public String getConfidence() {
        return confidence;
    }
    public List<String> getMatchedSkills() { return matchedSkills; }
    public List<String> getMissingSkills() { return missingSkills; }
    public List<String> getStrengths() { return strengths; }
    public List<String> getRisks() { return risks; }
    public String getRecommendation() { return recommendation; }
}