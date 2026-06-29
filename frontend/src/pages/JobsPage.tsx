import { useMemo, useState } from "react";
import CoverLetterToneSelector from "../components/CoverLetterToneSelector";
import type { JobPosting, CoverLetter, JobMatchResult } from "../api/jobApi";
import type { ApplicationCase } from "../api/applicationApi";

interface JobsPageProps {
  jobs?: JobPosting[];
  applicationCases?: ApplicationCase[];
  matchResults: Record<string, JobMatchResult>;
  coverLetters: Record<string, CoverLetter>;
  editedLetters: Record<string, string>;
  coverLetterTone: string;
  canUseApp: boolean;
  hasSavedProfile: boolean;
  isAnalyzing: boolean;
  isGenerating: boolean;
  isSaving: boolean;
  hasAnalyzeError: boolean;
  hasCoverLetterError: boolean;
  isDeleting: boolean;
  onDeleteLetter: (jobId: string) => void;
  onToneChange: (tone: string) => void;
  onAnalyze: (jobId: string) => void;
  onGenerateCoverLetter: (jobId: string, tone: string) => void;
  onCreateCase: (jobId: string) => void;
  onEditLetter: (jobId: string, content: string) => void;
  onSaveLetter: (jobId: string) => void;
}

const PAGE_SIZE = 25;

function JobsPage({
  jobs = [],
  applicationCases = [],
  matchResults,
  coverLetters,
  editedLetters,
  coverLetterTone,
  canUseApp,
  hasSavedProfile,
  isAnalyzing,
  isGenerating,
  isSaving,
  hasAnalyzeError,
  hasCoverLetterError,
  isDeleting,
  onDeleteLetter,
  onToneChange,
  onAnalyze,
  onGenerateCoverLetter,
  onCreateCase,
  onEditLetter,
  onSaveLetter,
}: JobsPageProps) {
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);

  const getCaseForJob = (jobId?: string) => {
    if (!jobId) return undefined;
    return applicationCases.find((item) => item.jobId === jobId);
  };

  const filteredJobs = useMemo(() => {
    return [...jobs]
      .filter((job) => {
        const searchText =
          `${job.title} ${job.company} ${job.location} ${job.workMode}`.toLowerCase();

        return searchText.includes(search.toLowerCase().trim());
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "TITLE":
            return a.title.localeCompare(b.title);
          case "COMPANY":
            return a.company.localeCompare(b.company);
          case "MATCH_HIGH": {
            const aScore = a.id ? matchResults[a.id]?.score ?? -1 : -1;
            const bScore = b.id ? matchResults[b.id]?.score ?? -1 : -1;
            return bScore - aScore;
          }
          case "NEWEST":
          default:
            return (b.createdAt ?? "").localeCompare(a.createdAt ?? "");
        }
      });
  }, [jobs, search, sortBy, matchResults]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedJobs = filteredJobs.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  const toggleExpanded = (jobId: string) => {
    setExpandedJobId((current) => (current === jobId ? null : jobId));
  };

  return (
    <section style={{ marginTop: "30px" }}>
      <div
        style={{
          position: "relative",
          marginBottom: "18px",
          minHeight: "52px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2 style={{ margin: "0 0 4px" }}>Saved Jobs</h2>
          <p style={{ margin: 0, color: "#666" }}>
            Manage saved jobs in a scalable table view.
          </p>
        </div>

        <strong
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            fontSize: "18px",
            color: "#5a5872",
            lineHeight: "36px",
          }}
        >
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
        </strong>
      </div>

      {canUseApp && !hasSavedProfile && (
        <div
          style={{
            border: "1px solid #f5c542",
            background: "#fff8db",
            color: "#5f4b00",
            padding: "14px",
            borderRadius: "12px",
            marginBottom: "16px",
          }}
        >
          <strong>Complete your profile first</strong>

          <p style={{ margin: "8px 0 0" }}>
            Before using AI Match or generating cover letters, go to{" "}
            <strong>Settings</strong> and save your profile.
          </p>
        </div>
      )}

      {jobs.length === 0 && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            background: "#fff",
          }}
        >
          <p>No jobs saved yet.</p>
          <p>Add your first job posting from the Dashboard.</p>
        </div>
      )}

      {jobs.length > 0 && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <input
              placeholder="Search jobs..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
            />

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="NEWEST">Newest</option>
              <option value="TITLE">Title A-Z</option>
              <option value="COMPANY">Company A-Z</option>
              <option value="MATCH_HIGH">Highest match</option>
            </select>
          </div>

          <div
            style={{
              border: "1px solid #ddd",
              borderRadius: "14px",
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.4fr 1fr 1fr 0.7fr 1fr 1fr",
                gap: "12px",
                padding: "12px 14px",
                background: "#f8f9fa",
                borderBottom: "1px solid #ddd",
                fontWeight: 700,
                fontSize: "13px",
                color: "#555",
              }}
            >
              <span>Job</span>
              <span>Company</span>
              <span>Location</span>
              <span>Match</span>
              <span>Status</span>
              <span>Actions</span>
            </div>

            {pagedJobs.map((job) => {
              if (!job.id) return null;

              const matchResult = matchResults[job.id];
              const coverLetter = coverLetters[job.id];
              const applicationCase = getCaseForJob(job.id);
              const isExpanded = expandedJobId === job.id;

              return (
                <article key={job.id}>
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleExpanded(job.id!)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        toggleExpanded(job.id!);
                      }
                    }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.4fr 1fr 1fr 0.7fr 1fr 1fr",
                      gap: "12px",
                      alignItems: "center",
                      padding: "14px",
                      cursor: "pointer",
                      borderBottom: isExpanded
                        ? "1px solid #eee"
                        : "1px solid #f1f1f1",
                    }}
                  >
                    <strong>{job.title}</strong>
                    <span>{job.company}</span>
                    <span style={{ color: "#666" }}>
                      {job.location} · {job.workMode}
                    </span>
                    <span>{matchResult ? `${matchResult.score}%` : "—"}</span>
                    <span>
                      {applicationCase?.status ||
                        (coverLetter ? "Cover Letter" : "Saved")}
                    </span>
                    <span style={{ color: "#777", fontSize: "13px" }}>
                      {isExpanded ? "Click to close" : "Click to open"}
                    </span>
                  </div>

                  {isExpanded && (
                    <div
                      style={{
                        padding: "18px",
                        background: "#fafafa",
                        borderBottom: "1px solid #eee",
                      }}
                    >
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1.3fr 1fr",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            border: "1px solid #eee",
                            borderRadius: "12px",
                            padding: "14px",
                            background: "#fff",
                          }}
                        >
                          <h3 style={{ marginTop: 0 }}>{job.title}</h3>

                          <p style={{ color: "#666" }}>
                            {job.company} · {job.location} · {job.workMode}
                          </p>

                          <p style={{ whiteSpace: "pre-wrap" }}>
                            {job.description}
                          </p>
                        </div>

                        <div
                          style={{
                            display: "grid",
                            gap: "10px",
                            alignContent: "start",
                            border: "1px solid #eee",
                            borderRadius: "12px",
                            padding: "14px",
                            background: "#fff",
                          }}
                        >
                          <h4
                            style={{
                              margin: 0,
                              fontSize: "16px",
                              fontWeight: 700,
                            }}
                          >
                            Actions
                          </h4>

                          <div>
                            <p
                              style={{
                                margin: "0 0 6px",
                                fontSize: "13px",
                                color: "#666",
                                fontWeight: 600,
                              }}
                            >
                              Cover letter tone
                            </p>

                            <CoverLetterToneSelector
                              tone={coverLetterTone}
                              onToneChange={onToneChange}
                            />
                          </div>

                          <hr
                            style={{
                              border: 0,
                              borderTop: "1px solid #e5e5e5",
                              margin: "4px 0 8px",
                            }}
                          />

                          <button
                            type="button"
                            className="primary-button"
                            disabled={!canUseApp || !hasSavedProfile || isAnalyzing}
                            onClick={() => onAnalyze(job.id!)}
                          >
                            {isAnalyzing ? "Analyzing..." : "Analyze match"}
                          </button>

                          <button
                            type="button"
                            className="primary-button"
                            disabled={!canUseApp || !hasSavedProfile || isGenerating}
                            onClick={() =>
                              onGenerateCoverLetter(job.id!, coverLetterTone)
                            }
                          >
                            {isGenerating
                              ? "Generating..."
                              : "Generate cover letter"}
                          </button>

                          <button
                            type="button"
                            className="primary-button"
                            disabled={!canUseApp || !!applicationCase}
                            onClick={() => onCreateCase(job.id!)}
                          >
                            {applicationCase
                              ? "Application case created"
                              : "Create application case"}
                          </button>

                          {coverLetter && (
                            <button
                              type="button"
                              className="danger-button"
                              disabled={isDeleting}
                              onClick={() => onDeleteLetter(job.id!)}
                            >
                              {isDeleting
                                ? "Deleting..."
                                : "Delete cover letter"}
                            </button>
                          )}
                        </div>
                      </div>

                      {hasAnalyzeError && (
                        <p style={{ color: "crimson" }}>
                          Could not analyze this job.
                        </p>
                      )}

                      {matchResult && (
                        <div
                          style={{
                            marginTop: "16px",
                            border: "1px solid #eee",
                            borderRadius: "12px",
                            padding: "14px",
                            background: "#fff",
                          }}
                        >
                          <h3>AI Match Report</h3>

                          <p>
                            <strong>Match score:</strong> {matchResult.score}%
                          </p>

                          <p>
                            <strong>AI confidence:</strong>{" "}
                            {matchResult.confidence}
                          </p>

                          <p>
                            <strong>Matched skills:</strong>{" "}
                            {matchResult.matchedSkills.join(", ") || "—"}
                          </p>

                          <p>
                            <strong>Missing skills:</strong>{" "}
                            {matchResult.missingSkills.join(", ") || "—"}
                          </p>

                          <p>
                            <strong>Strengths:</strong>{" "}
                            {matchResult.strengths.join(", ") || "—"}
                          </p>

                          <p>
                            <strong>Risks:</strong>{" "}
                            {matchResult.risks.join(", ") || "—"}
                          </p>

                          <p>
                            <strong>Recommendation:</strong>{" "}
                            {matchResult.recommendation}
                          </p>
                        </div>
                      )}

                      {hasCoverLetterError && (
                        <p style={{ color: "crimson" }}>
                          Could not generate cover letter.
                        </p>
                      )}

                      {coverLetter && (
                        <div
                          style={{
                            marginTop: "16px",
                            border: "1px solid #eee",
                            borderRadius: "12px",
                            padding: "14px",
                            background: "#fff",
                          }}
                        >
                          <h3>Cover Letter</h3>

                          <textarea
                            rows={12}
                            value={editedLetters[job.id] ?? coverLetter.content}
                            onChange={(event) =>
                              onEditLetter(job.id!, event.target.value)
                            }
                            style={{
                              width: "100%",
                              boxSizing: "border-box",
                            }}
                          />

                          <button
                            type="button"
                            className="primary-button"
                            disabled={isSaving}
                            onClick={() => onSaveLetter(job.id!)}
                            style={{ marginTop: "10px" }}
                          >
                            {isSaving ? "Saving..." : "Save cover letter"}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          {filteredJobs.length > PAGE_SIZE && (
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
                className="primary-button"
                disabled={safeCurrentPage === 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
              >
                Previous
              </button>

              <span>
                Page {safeCurrentPage} of {totalPages}
              </span>

              <button
                type="button"
                className="primary-button"
                disabled={safeCurrentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default JobsPage;