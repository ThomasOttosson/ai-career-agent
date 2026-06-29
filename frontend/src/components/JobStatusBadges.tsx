import type { CoverLetter, JobMatchResult } from "../api/jobApi";
import type { ApplicationCase } from "../api/applicationApi";

interface JobStatusBadgesProps {
  matchResult?: JobMatchResult;
  coverLetter?: CoverLetter;
  applicationCase?: ApplicationCase;
}

function JobStatusBadges({
  matchResult,
  coverLetter,
  applicationCase,
}: JobStatusBadgesProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        flexWrap: "wrap",
        marginBottom: "12px",
      }}
    >
      <span>✅ Job Found</span>
      <span>{matchResult ? "✅" : "⬜"} Analyzed</span>
      <span>{coverLetter ? "✅" : "⬜"} Cover Letter</span>
      <span>
        {applicationCase &&
        ["APPROVED", "READY_TO_APPLY"].includes(applicationCase.status)
          ? "✅"
          : "⬜"}{" "}
        Human Approval
      </span>
      <span>
        {applicationCase?.status === "READY_TO_APPLY" ? "✅" : "⬜"} Ready To
        Apply
      </span>
    </div>
  );
}

export default JobStatusBadges;