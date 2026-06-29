import type { CoverLetter, JobMatchResult, JobPosting } from "../api/jobApi";
import type { ApplicationCase } from "../api/applicationApi";

interface DashboardProps {
  jobs?: JobPosting[];
  matchResults: Record<string, JobMatchResult>;
  coverLetters: Record<string, CoverLetter>;
  applicationCases?: ApplicationCase[];
  isAiWorking: boolean;
}

function Dashboard({
  jobs,
  matchResults,
  coverLetters,
  applicationCases,
  isAiWorking,
}: DashboardProps) {
  return (
    <>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "14px",
          margin: "20px 0",
          maxWidth: "850px",
        }}
      >
        <div className="dashboard-card">
          <h3>Total jobs</h3>
          <p>{jobs?.length ?? 0}</p>
        </div>

        <div className="dashboard-card">
          <h3>Analyzed</h3>
          <p>{Object.keys(matchResults).length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Cover letters</h3>
          <p>{Object.keys(coverLetters).length}</p>
        </div>

        <div className="dashboard-card">
          <h3>Ready</h3>
          <p>
            {applicationCases?.filter(
              (applicationCase) => applicationCase.status === "READY_TO_APPLY"
            ).length ?? 0}
          </p>
        </div>
      </section>

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "12px 14px",
          margin: "12px 0 20px",
          background: "#fff",
          fontSize: "14px",
        }}
      >
        <strong>AI Agent Status:</strong> {isAiWorking ? "Working..." : "Ready"}
      </section>
    </>
  );
}

export default Dashboard;