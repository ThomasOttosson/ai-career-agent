import type { JobMatchResult } from "../api/jobApi";

interface MatchReportProps {
  matchResult: JobMatchResult;
}

function MatchReport({ matchResult }: MatchReportProps) {
  return (
    <div
      style={{
        marginTop: "16px",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h4>AI Match Report</h4>

      <p>
        <strong>Match score:</strong> {matchResult.score}%
      </p>

      <p>
        <strong>AI confidence:</strong>{" "}
        {matchResult.confidence === "High"
          ? "🟢 High"
          : matchResult.confidence === "Medium"
            ? "🟡 Medium"
            : "🔴 Low"}
      </p>

      <p>
        <strong>Matched skills:</strong> {matchResult.matchedSkills.join(", ")}
      </p>

      <p>
        <strong>Missing skills:</strong> {matchResult.missingSkills.join(", ")}
      </p>

      <p>
        <strong>Strengths:</strong> {matchResult.strengths.join(" ")}
      </p>

      <p>
        <strong>Risks:</strong> {matchResult.risks.join(" ")}
      </p>

      <div
        style={{
          marginTop: "12px",
          padding: "10px",
          borderRadius: "8px",
          background: "#f8f9fa",
        }}
      >
        <strong>Why this score?</strong>
        <p style={{ marginBottom: 0 }}>
          {`This score is based on ${matchResult.matchedSkills.length} matched skills and ${matchResult.missingSkills.length} missing skills from your profile.`}
        </p>
      </div>

      <p>
        <strong>Recommendation:</strong> {matchResult.recommendation}
      </p>
    </div>
  );
}

export default MatchReport;