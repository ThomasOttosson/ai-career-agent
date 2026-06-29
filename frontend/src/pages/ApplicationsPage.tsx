import ApplicationList from "../components/ApplicationList";
import type { ApplicationCase } from "../api/applicationApi";
import type { CoverLetter, JobPosting } from "../api/jobApi";
import { Link } from "react-router-dom";

interface ApplicationsPageProps {
  isLoggedIn: boolean;
  jobs?: JobPosting[];
  applicationCases?: ApplicationCase[];
  coverLetters: Record<string, CoverLetter>;
  getStatusStyle?: (status: string) => React.CSSProperties;
  onApprove: (caseId: string) => void;
  onReady: (caseId: string) => void;
  onApplied: (caseId: string) => void;
  onInterview: (caseId: string) => void;
  onOffer: (caseId: string) => void;
  onHired: (caseId: string) => void;
  onRejected: (caseId: string) => void;
  onDelete: (caseId: string) => void;
  onUpdate: (
    caseId: string,
    status: string,
    notes: string,
    followUpDate: string,
  ) => void;
}

function ApplicationsPage({
  isLoggedIn,
  jobs,
  applicationCases,
  onApprove,
  onReady,
  onApplied,
  onInterview,
  onOffer,
  onHired,
  onRejected,
  onDelete,
  onUpdate,
}: ApplicationsPageProps) {
  if (!isLoggedIn) {
    return (
      <section>
        <h2>Applications</h2>
        <p>Login or register to manage application cases.</p>
      </section>
    );
  }

  if (!applicationCases || applicationCases.length === 0) {
    return (
      <section>
        <h2>Application Cases</h2>

        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            background: "#fff",
            textAlign: "center",
          }}
        >
          <p>No application cases yet.</p>

          <Link
            to="/jobs"
            className="primary-button"
            style={{
              display: "inline-block",
              textDecoration: "none",
              marginTop: "8px",
              minWidth: "160px",
            }}
          >
            Go to Jobs
          </Link>
        </div>
      </section>
    );
  }

  return (
    <ApplicationList
      applicationCases={applicationCases}
      jobs={jobs}
      onApprove={onApprove}
      onReady={onReady}
      onApplied={onApplied}
      onInterview={onInterview}
      onOffer={onOffer}
      onHired={onHired}
      onRejected={onRejected}
      onDelete={onDelete}
      onUpdate={onUpdate}
    />
  );
}

export default ApplicationsPage;