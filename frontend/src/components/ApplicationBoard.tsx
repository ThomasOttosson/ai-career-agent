import type { ApplicationCase } from "../api/applicationApi";
import type { JobPosting } from "../api/jobApi";

interface ApplicationBoardProps {
  applicationCases?: ApplicationCase[];
  jobs?: JobPosting[];
  onApprove: (caseId: string) => void;
  onReady: (caseId: string) => void;
  onApplied: (caseId: string) => void;
  onInterview: (caseId: string) => void;
  onOffer: (caseId: string) => void;
  onHired: (caseId: string) => void;
  onRejected: (caseId: string) => void;
}

const columns = [
  { title: "🟡 New", status: "NEW" },
  { title: "🟢 Approved", status: "APPROVED" },
  { title: "🔵 Ready", status: "READY_TO_APPLY" },
  { title: "🚀 Applied", status: "APPLIED" },
  { title: "📅 Interview", status: "INTERVIEW" },
  { title: "💼 Offer", status: "OFFER" },
  { title: "🏆 Hired", status: "HIRED" },
  { title: "❌ Rejected", status: "REJECTED" },
];

function ApplicationBoard({
  applicationCases,
  jobs,
  onApprove,
  onReady,
  onApplied,
  onInterview,
  onOffer,
  onHired,
  onRejected,
}: ApplicationBoardProps) {
  return (
    <section>
      <h2>My Applications</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(220px, 1fr))",
          gap: "16px",
          alignItems: "start",
          overflowX: "auto",
        }}
      >
        {columns.map((column) => {
          const casesForColumn = applicationCases?.filter(
            (applicationCase) => applicationCase.status === column.status,
          );

          return (
            <div
              key={column.status}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "12px",
                background: "#f8f9fa",
                minHeight: "220px",
              }}
            >
              <h3>{column.title}</h3>

              {casesForColumn?.length === 0 && (
                <p style={{ color: "#777", fontSize: "14px" }}>
                  No applications here yet.
                </p>
              )}

              {casesForColumn?.map((applicationCase) => {
                const job = jobs?.find(
                  (job) => job.id === applicationCase.jobId,
                );

                return (
                  <article
                    key={applicationCase.id}
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: "10px",
                      padding: "10px",
                      marginBottom: "10px",
                      background: "#fff",
                    }}
                  >
                    <strong>{job?.title ?? "Unknown job"}</strong>

                    <p style={{ margin: "4px 0" }}>
                      {job?.company ?? "Unknown company"}
                    </p>

                    <p style={{ marginBottom: 0 }}>
                      Status: {applicationCase.status}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        marginTop: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      {applicationCase.status === "NEW" && (
                        <button
                          type="button"
                          onClick={() => onApprove(applicationCase.id)}
                        >
                          Approve
                        </button>
                      )}

                      {applicationCase.status === "APPROVED" && (
                        <button
                          type="button"
                          onClick={() => onReady(applicationCase.id)}
                        >
                          Mark ready
                        </button>
                      )}

                      {applicationCase.status === "READY_TO_APPLY" && (
                        <button
                          type="button"
                          onClick={() => onApplied(applicationCase.id)}
                        >
                          Mark applied
                        </button>
                      )}

                      {applicationCase.status === "APPLIED" && (
                        <>
                          <button
                            type="button"
                            onClick={() => onInterview(applicationCase.id)}
                          >
                            Mark interview
                          </button>

                          <button
                            type="button"
                            onClick={() => onRejected(applicationCase.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {applicationCase.status === "INTERVIEW" && (
                        <>
                          <button
                            type="button"
                            onClick={() => onOffer(applicationCase.id)}
                          >
                            Mark offer
                          </button>

                          <button
                            type="button"
                            onClick={() => onRejected(applicationCase.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {applicationCase.status === "OFFER" && (
                        <>
                          <button
                            type="button"
                            onClick={() => onHired(applicationCase.id)}
                          >
                            Mark hired
                          </button>

                          <button
                            type="button"
                            onClick={() => onRejected(applicationCase.id)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default ApplicationBoard;