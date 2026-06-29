import { useMemo, useState } from "react";
import type { ApplicationCase } from "../api/applicationApi";
import type { JobPosting } from "../api/jobApi";

interface ApplicationListProps {
  applicationCases?: ApplicationCase[];
  jobs?: JobPosting[];
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

const PAGE_SIZE = 25;

const statuses = [
  "ALL",
  "NEW",
  "APPROVED",
  "READY_TO_APPLY",
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
];

function formatDate(value?: string) {
  if (!value) return "Unknown date";

  return new Date(value).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getDaysAgo(value?: string) {
  if (!value) return "";

  const created = new Date(value).getTime();
  const now = Date.now();

  const days = Math.floor((now - created) / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";

  return `${days} days ago`;
}

function getStatusDate(applicationCase: ApplicationCase) {
  switch (applicationCase.status) {
    case "APPROVED":
      return { label: "Approved", value: applicationCase.approvedAt };
    case "APPLIED":
      return { label: "Applied", value: applicationCase.appliedAt };
    case "INTERVIEW":
      return { label: "Interview", value: applicationCase.interviewAt };
    case "OFFER":
      return { label: "Offer", value: applicationCase.offerAt };
    case "HIRED":
      return { label: "Hired", value: applicationCase.hiredAt };
    case "REJECTED":
      return { label: "Rejected", value: applicationCase.rejectedAt };
    default:
      return { label: "Created", value: applicationCase.createdAt };
  }
}

function ApplicationTimeline({
  applicationCase,
}: {
  applicationCase: ApplicationCase;
}) {
  const statusOrder = [
    "NEW",
    "APPROVED",
    "READY_TO_APPLY",
    "APPLIED",
    "INTERVIEW",
    "OFFER",
    "HIRED",
  ];

  const currentStatusIndex = statusOrder.indexOf(applicationCase.status);

  const steps = [
    { label: "Created", status: "NEW", date: applicationCase.createdAt },
    { label: "Approved", status: "APPROVED", date: applicationCase.approvedAt },
    {
      label: "Ready",
      status: "READY_TO_APPLY",
      date: undefined,
    },
    { label: "Applied", status: "APPLIED", date: applicationCase.appliedAt },
    {
      label: "Interview",
      status: "INTERVIEW",
      date: applicationCase.interviewAt,
    },
    { label: "Offer", status: "OFFER", date: applicationCase.offerAt },
    { label: "Hired", status: "HIRED", date: applicationCase.hiredAt },
  ];

  return (
    <div style={{ display: "grid", gap: "6px" }}>
      {steps.map((step) => {
        const stepIndex = statusOrder.indexOf(step.status);
        const isCompleted = currentStatusIndex >= stepIndex;

        return (
          <div
            key={step.status}
            style={{
              display: "grid",
              gridTemplateColumns: "24px 90px 1fr",
              gap: "8px",
              fontSize: "13px",
              color: isCompleted ? "#111" : "#999",
            }}
          >
            <span>{isCompleted ? "✓" : "○"}</span>
            <span>{step.label}</span>
            <span>
              {step.date
                ? formatDate(step.date)
                : isCompleted
                  ? "Completed"
                  : "Not reached"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ApplicationEditForm({
  applicationCase,
  onUpdate,
}: {
  applicationCase: ApplicationCase;
  onUpdate: (
    caseId: string,
    status: string,
    notes: string,
    followUpDate: string,
  ) => void;
}) {
  const [status, setStatus] = useState(applicationCase.status);
  const [notes, setNotes] = useState(applicationCase.notes ?? "");
  const [followUpDate, setFollowUpDate] = useState(
    applicationCase.followUpDate ?? "",
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onUpdate(applicationCase.id, status, notes, followUpDate);
      }}
      style={{
        display: "grid",
        gap: "10px",
      }}
    >
      <label style={{ display: "grid", gap: "6px", fontSize: "13px" }}>
        Status
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {statuses
            .filter((item) => item !== "ALL")
            .map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
        </select>
      </label>

      <label style={{ display: "grid", gap: "6px", fontSize: "13px" }}>
        Notes
        <textarea
          placeholder="Add notes about this application..."
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={4}
          style={{
            width: "100%",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      </label>

      <label style={{ display: "grid", gap: "6px", fontSize: "13px" }}>
        Follow-up date
        <input
          type="date"
          value={followUpDate}
          onChange={(event) => setFollowUpDate(event.target.value)}
        />
      </label>

      <button
        type="submit"
        className="primary-button"
        style={{
          width: "100%",
        }}
      >
        Save changes
      </button>
    </form>
  );
}

function ApplicationList({
  applicationCases = [],
  jobs = [],
  onApprove,
  onReady,
  onApplied,
  onInterview,
  onOffer,
  onHired,
  onRejected,
  onDelete,
  onUpdate,
}: ApplicationListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);

  const rows = useMemo(() => {
    return applicationCases
      .map((applicationCase) => {
        const job = jobs.find((job) => job.id === applicationCase.jobId);
        const statusDate = getStatusDate(applicationCase);

        return {
          applicationCase,
          title: job?.title ?? "Unknown job",
          company: job?.company ?? "Unknown company",
          location: job?.location ?? "Unknown location",
          status: applicationCase.status,
          createdAt: applicationCase.createdAt ?? "",
          statusDate,
        };
      })
      .filter((row) => {
        const matchesStatus =
          statusFilter === "ALL" || row.status === statusFilter;

        const searchText =
          `${row.title} ${row.company} ${row.location} ${row.status}`
            .toLowerCase()
            .trim();

        const matchesSearch = searchText.includes(search.toLowerCase().trim());

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "OLDEST":
            return a.createdAt.localeCompare(b.createdAt);
          case "COMPANY":
            return a.company.localeCompare(b.company);
          case "STATUS":
            return a.status.localeCompare(b.status);
          case "NEWEST":
          default:
            return b.createdAt.localeCompare(a.createdAt);
        }
      });
  }, [applicationCases, jobs, search, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedRows = rows.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  const stats = {
    total: applicationCases.length,
    applied: applicationCases.filter((item) => item.status === "APPLIED")
      .length,
    interview: applicationCases.filter((item) => item.status === "INTERVIEW")
      .length,
    offer: applicationCases.filter((item) => item.status === "OFFER").length,
    hired: applicationCases.filter((item) => item.status === "HIRED").length,
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const toggleExpanded = (caseId: string) => {
    setExpandedCaseId((current) => (current === caseId ? null : caseId));
  };

  return (
    <section>
      <h2>My Applications</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Applied" value={stats.applied} />
        <StatCard label="Interview" value={stats.interview} />
        <StatCard label="Offer" value={stats.offer} />
        <StatCard label="Hired" value={stats.hired} />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: "10px",
          marginBottom: "16px",
        }}
      >
        <input
          placeholder="Search applications..."
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => handleStatusChange(event.target.value)}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status === "ALL" ? "All statuses" : status}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(event) => handleSortChange(event.target.value)}
        >
          <option value="NEWEST">Newest</option>
          <option value="OLDEST">Oldest</option>
          <option value="COMPANY">Company A-Z</option>
          <option value="STATUS">Status</option>
        </select>
      </div>

      <p style={{ color: "#666", fontSize: "14px" }}>
        Showing {pagedRows.length} of {rows.length} filtered applications ·{" "}
        {applicationCases.length} total
      </p>

      <div style={{ display: "grid", gap: "8px" }}>
        {pagedRows.map(
          ({
            applicationCase,
            title,
            company,
            location,
            status,
            statusDate,
          }) => {
            const isExpanded = expandedCaseId === applicationCase.id;

            return (
              <article
                key={applicationCase.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "12px",
                  background: "#fff",
                  overflow: "hidden",
                }}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleExpanded(applicationCase.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      toggleExpanded(applicationCase.id);
                    }
                  }}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    cursor: "pointer",
                    textAlign: "left",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.4fr 1fr 1fr auto auto auto",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    <strong>{title}</strong>
                    <span style={{ color: "#555" }}>{company}</span>
                    <span style={{ color: "#666" }}>{location}</span>

                    <span
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "999px",
                        padding: "4px 8px",
                        fontSize: "12px",
                        background: "#f8f9fa",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {status}
                    </span>

                    <span
                      style={{
                        color: "#777",
                        fontSize: "13px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {formatDate(statusDate.value)}
                    </span>

                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        justifyContent: "flex-end",
                      }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <button
                        className="edit-button"
                        type="button"
                        onClick={() => toggleExpanded(applicationCase.id)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm(
                            "Are you sure you want to delete this application?",
                          );

                          if (confirmed) {
                            onDelete(applicationCase.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      borderTop: "1px solid #eee",
                      padding: "14px",
                      background: "#fafafa",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 12px",
                        color: "#777",
                        fontSize: "13px",
                      }}
                    >
                      {statusDate.label}: {formatDate(statusDate.value)} •{" "}
                      {getDaysAgo(statusDate.value)}
                    </p>

                    {(applicationCase.notes ||
                      applicationCase.followUpDate) && (
                      <div
                        style={{
                          border: "1px solid #eee",
                          borderRadius: "10px",
                          padding: "10px",
                          background: "#fff",
                          marginBottom: "12px",
                        }}
                      >
                        {applicationCase.notes && (
                          <p style={{ margin: "0 0 8px" }}>
                            <strong>Notes:</strong> {applicationCase.notes}
                          </p>
                        )}

                        {applicationCase.followUpDate && (
                          <p style={{ margin: 0 }}>
                            <strong>Follow-up:</strong>{" "}
                            {formatDate(applicationCase.followUpDate)}
                          </p>
                        )}
                      </div>
                    )}

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr auto",
                        gap: "16px",
                        alignItems: "start",
                      }}
                    >
                      <ApplicationTimeline applicationCase={applicationCase} />

                      <ApplicationEditForm
                        applicationCase={applicationCase}
                        onUpdate={onUpdate}
                      />

                      <ApplicationActions
                        applicationCase={applicationCase}
                        onApprove={onApprove}
                        onReady={onReady}
                        onApplied={onApplied}
                        onInterview={onInterview}
                        onOffer={onOffer}
                        onHired={onHired}
                        onRejected={onRejected}
                      />
                    </div>
                  </div>
                )}
              </article>
            );
          },
        )}

        {rows.length === 0 && (
          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "16px",
              background: "#fff",
            }}
          >
            No applications match your search.
          </div>
        )}
      </div>

      {rows.length > PAGE_SIZE && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
          }}
        >
          <button
            type="button"
            disabled={safeCurrentPage === 1}
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          >
            Previous
          </button>

          <span>
            Page {safeCurrentPage} of {totalPages}
          </span>

          <button
            type="button"
            disabled={safeCurrentPage === totalPages}
            onClick={() =>
              setCurrentPage((page) => Math.min(totalPages, page + 1))
            }
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "14px",
        background: "#fff",
      }}
    >
      <p style={{ margin: 0, color: "#666", fontSize: "13px" }}>{label}</p>
      <strong style={{ fontSize: "24px" }}>{value}</strong>
    </article>
  );
}

function ApplicationActions({
  applicationCase,
  onApprove,
  onReady,
  onApplied,
  onInterview,
  onOffer,
  onHired,
  onRejected,
}: {
  applicationCase: ApplicationCase;
  onApprove: (caseId: string) => void;
  onReady: (caseId: string) => void;
  onApplied: (caseId: string) => void;
  onInterview: (caseId: string) => void;
  onOffer: (caseId: string) => void;
  onHired: (caseId: string) => void;
  onRejected: (caseId: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {applicationCase.status === "NEW" && (
        <button
          type="button"
          className="primary-button"
          onClick={() => onApprove(applicationCase.id)}
        >
          Approve
        </button>
      )}

      {applicationCase.status === "APPROVED" && (
        <button
          type="button"
          className="primary-button"
          onClick={() => onReady(applicationCase.id)}
        >
          Mark ready
        </button>
      )}

      {applicationCase.status === "READY_TO_APPLY" && (
        <button
          type="button"
          className="primary-button"
          onClick={() => onApplied(applicationCase.id)}
        >
          Mark applied
        </button>
      )}

      {applicationCase.status === "APPLIED" && (
        <>
          <button
            type="button"
            className="primary-button"
            onClick={() => onInterview(applicationCase.id)}
          >
            Interview
          </button>
          <button
            type="button"
            className="delete-button"
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
            className="primary-button"
            onClick={() => onOffer(applicationCase.id)}
          >
            Offer
          </button>
          <button
            type="button"
            className="delete-button"
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
            className="primary-button"
            onClick={() => onHired(applicationCase.id)}
          >
            Hired
          </button>
          <button
            type="button"
            className="delete-button"
            onClick={() => onRejected(applicationCase.id)}
          >
            Reject
          </button>
        </>
      )}
    </div>
  );
}

export default ApplicationList;
