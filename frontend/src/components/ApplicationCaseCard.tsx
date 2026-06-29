import type { ApplicationCase } from "../api/applicationApi";

interface ApplicationCaseCardProps {
  applicationCase: ApplicationCase;
  hasCoverLetter: boolean;
  getStatusStyle: (status: string) => React.CSSProperties;
  onApprove: (caseId: string) => void;
  onReady: (caseId: string) => void;
}

function ApplicationCaseCard({
  applicationCase,
  hasCoverLetter,
  getStatusStyle,
  onApprove,
  onReady,
}: ApplicationCaseCardProps) {
  return (
    <article
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "14px",
        marginBottom: "12px",
        background: "#fff",
      }}
    >
      <p>
        <strong>Case ID:</strong> {applicationCase.id}
      </p>

      <p>
        <strong>Job ID:</strong> {applicationCase.jobId}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        <span
          style={{
            ...getStatusStyle(applicationCase.status),
            padding: "6px 12px",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {applicationCase.status}
        </span>
      </p>

      <ul style={{ fontSize: "14px", marginTop: "10px" }}>
        <li>{hasCoverLetter ? "✅" : "⬜"} Cover letter generated</li>
        <li>{hasCoverLetter ? "✅" : "⬜"} Cover letter available</li>
        <li>
          {applicationCase.status === "APPROVED" ||
          applicationCase.status === "READY_TO_APPLY"
            ? "✅"
            : "⬜"}{" "}
          Human approved
        </li>
        <li>
          {applicationCase.status === "READY_TO_APPLY" ? "✅" : "⬜"} Ready to
          apply
        </li>
      </ul>

      {applicationCase.status === "NEW" && (
        <button
          type="button"
          onClick={() => onApprove(applicationCase.id)}
          disabled={!hasCoverLetter}
        >
          {hasCoverLetter ? "Approve" : "Generate cover letter first"}
        </button>
      )}

      {applicationCase.status === "APPROVED" && (
        <button
          type="button"
          onClick={() => onReady(applicationCase.id)}
          disabled={!hasCoverLetter}
        >
          {hasCoverLetter ? "Mark ready to apply" : "Cover letter required"}
        </button>
      )}
    </article>
  );
}

export default ApplicationCaseCard;