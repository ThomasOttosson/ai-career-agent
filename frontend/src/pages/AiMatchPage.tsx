import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { JobMatchResult, JobPosting } from "../api/jobApi";

interface AiMatchPageProps {
  jobs?: JobPosting[];
  matchResults: Record<string, JobMatchResult>;
  onDeleteMatch: (jobId: string) => void;
}

const PAGE_SIZE = 25;

function getMatchLabel(score: number) {
  if (score >= 80) return "🟢 Excellent match";
  if (score >= 60) return "🟡 Good match";
  return "🔴 Needs improvement";
}

function getConfidenceLabel(confidence: string) {
  if (confidence === "High") return "🟢 High";
  if (confidence === "Medium") return "🟡 Medium";
  if (confidence === "Low") return "🔴 Low";
  return confidence;
}

function SkillList({ title, items }: { title: string; items: string[] }) {
  return (
    <div
      style={{
        border: "1px solid #eee",
        borderRadius: "10px",
        padding: "12px",
        background: "#fff",
      }}
    >
      <strong>{title}</strong>

      {items.length === 0 ? (
        <p style={{ color: "#777", marginBottom: 0 }}>No items found.</p>
      ) : (
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginTop: "10px",
          }}
        >
          {items.map((item) => (
            <span
              key={item}
              style={{
                border: "1px solid #ddd",
                borderRadius: "999px",
                padding: "4px 8px",
                fontSize: "12px",
                background: "#f8f9fa",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
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

function AiMatchPage({
  jobs = [],
  matchResults,
  onDeleteMatch,
}: AiMatchPageProps) {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("HIGHEST_SCORE");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const analyzedRows = useMemo(() => {
    return jobs
      .filter((job) => job.id && matchResults[job.id])
      .map((job) => {
        const match = matchResults[job.id!];

        return {
          match,
          id: job.id!,
          title: job.title,
          company: job.company,
          location: job.location,
          score: match.score,
          confidence: match.confidence,
        };
      })
      .filter((row) => {
        const searchText =
          `${row.title} ${row.company} ${row.location} ${row.score} ${row.confidence}`.toLowerCase();

        return searchText.includes(search.toLowerCase().trim());
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "LOWEST_SCORE":
            return a.score - b.score;
          case "COMPANY":
            return a.company.localeCompare(b.company);
          case "TITLE":
            return a.title.localeCompare(b.title);
          case "HIGHEST_SCORE":
          default:
            return b.score - a.score;
        }
      });
  }, [jobs, matchResults, search, sortBy]);

  const totalAnalyses = jobs.filter(
    (job) => job.id && matchResults[job.id],
  ).length;

  const averageScore =
    totalAnalyses > 0
      ? Math.round(
          jobs
            .filter((job) => job.id && matchResults[job.id])
            .reduce((sum, job) => sum + matchResults[job.id!].score, 0) /
            totalAnalyses,
        )
      : 0;

  const excellentMatches = jobs.filter(
    (job) => job.id && matchResults[job.id]?.score >= 80,
  ).length;

  const totalPages = Math.max(1, Math.ceil(analyzedRows.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const pagedRows = analyzedRows.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE,
  );

  const toggleExpanded = (jobId: string) => {
    setExpandedJobId((current) => (current === jobId ? null : jobId));
  };

  const handleDelete = (jobId: string) => {
    const shouldDelete = window.confirm("Delete this AI match analysis?");

    if (!shouldDelete) return;

    onDeleteMatch(jobId);

    if (expandedJobId === jobId) {
      setExpandedJobId(null);
    }
  };

  return (
    <section>
      <h2>AI Match History</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <StatCard label="Total analyses" value={totalAnalyses} />
        <StatCard label="Average match" value={`${averageScore}%`} />
        <StatCard label="Excellent matches" value={excellentMatches} />
      </div>

      {totalAnalyses === 0 && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            background: "#fff",
          }}
        >
          <p>No AI match analyses yet.</p>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate("/jobs")}
          >
            Go to Jobs
          </button>
        </div>
      )}

      {totalAnalyses > 0 && (
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
              placeholder="Search AI matches..."
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
              <option value="HIGHEST_SCORE">Highest score</option>
              <option value="LOWEST_SCORE">Lowest score</option>
              <option value="COMPANY">Company A-Z</option>
              <option value="TITLE">Title A-Z</option>
            </select>
          </div>

          <div style={{ display: "grid", gap: "8px" }}>
            {pagedRows.map(
              ({ id, title, company, location, score, confidence, match }) => {
                const isExpanded = expandedJobId === id;

                return (
                  <article
                    key={id}
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
                      onClick={() => toggleExpanded(id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          toggleExpanded(id);
                        }
                      }}
                      style={{
                        padding: "12px 14px",
                        cursor: "pointer",
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
                          {score}%
                        </span>

                        <span
                          style={{
                            color: "#777",
                            fontSize: "13px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {getConfidenceLabel(confidence)}
                        </span>

                        <button
                          className="delete-button"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDelete(id);
                          }}
                        >
                          Delete
                        </button>
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
                          {getMatchLabel(score)} · AI confidence:{" "}
                          {getConfidenceLabel(confidence)}
                        </p>

                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                            gap: "12px",
                          }}
                        >
                          <SkillList
                            title="Matched skills"
                            items={match.matchedSkills}
                          />
                          <SkillList
                            title="Missing skills"
                            items={match.missingSkills}
                          />
                          <SkillList
                            title="Strengths"
                            items={match.strengths}
                          />
                          <SkillList title="Risks" items={match.risks} />
                        </div>

                        <div
                          style={{
                            border: "1px solid #eee",
                            borderRadius: "10px",
                            padding: "12px",
                            background: "#fff",
                            marginTop: "12px",
                          }}
                        >
                          <strong>Recommendation</strong>
                          <p style={{ marginBottom: 0 }}>
                            {match.recommendation}
                          </p>
                        </div>
                      </div>
                    )}
                  </article>
                );
              },
            )}
          </div>

          {analyzedRows.length > PAGE_SIZE && (
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
        </>
      )}
    </section>
  );
}

export default AiMatchPage;