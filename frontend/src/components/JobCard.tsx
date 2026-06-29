import type { CoverLetter, JobMatchResult, JobPosting } from "../api/jobApi";
import type { ApplicationCase } from "../api/applicationApi";
import CoverLetterPanel from "./CoverLetterPanel";
import MatchReport from "./MatchReport";
import JobStatusBadges from "./JobStatusBadges";
import JobActions from "./JobActions";
import LoginRequiredNotice from "./LoginRequiredNotice";
import JobHeader from "./JobHeader";
import CoverLetterRequiredNotice from "./CoverLetterRequiredNotice";

interface JobCardProps {
  job: JobPosting;
  applicationCase?: ApplicationCase;
  matchResult?: JobMatchResult;
  coverLetter?: CoverLetter;
  editedLetter?: string;
  coverLetterTone: string;
  isAnalyzing: boolean;
  isGenerating: boolean;
  isSaving: boolean;
  canUseApp: boolean;
  hasAnalyzeError: boolean;
  hasCoverLetterError: boolean;
  isDeleting: boolean;
  onDeleteLetter: (jobId: string) => void;
  onAnalyze: (jobId: string) => void;
  onGenerateCoverLetter: (jobId: string, tone: string) => void;
  onCreateCase: (jobId: string) => void;
  onEditLetter: (jobId: string, content: string) => void;
  onSaveLetter: (jobId: string) => void;
}

function JobCard({
  job,
  applicationCase,
  matchResult,
  coverLetter,
  editedLetter,
  coverLetterTone,
  isAnalyzing,
  isGenerating,
  isSaving,
  hasAnalyzeError,
  hasCoverLetterError,
  canUseApp,
  isDeleting,
  onDeleteLetter,
  onAnalyze,
  onGenerateCoverLetter,
  onCreateCase,
  onEditLetter,
  onSaveLetter,
}: JobCardProps) {
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
      <JobHeader
        title={job.title}
        company={job.company}
        location={job.location}
        workMode={job.workMode}
        description={job.description}
      />

      <JobStatusBadges
        matchResult={matchResult}
        coverLetter={coverLetter}
        applicationCase={applicationCase}
      />

      {job.id && !coverLetter && <CoverLetterRequiredNotice />}

      {!canUseApp && <LoginRequiredNotice />}

      <JobActions
        jobId={job.id}
        coverLetterTone={coverLetterTone}
        isAnalyzing={isAnalyzing}
        isGenerating={isGenerating}
        canUseApp={canUseApp}
        onAnalyze={onAnalyze}
        onGenerateCoverLetter={onGenerateCoverLetter}
        onCreateCase={onCreateCase}
      />

      {hasAnalyzeError && (
        <p style={{ color: "crimson", fontSize: "14px" }}>
          Could not analyze match. Check backend or OpenAI API key.
        </p>
      )}

      {hasCoverLetterError && (
        <p style={{ color: "crimson", fontSize: "14px" }}>
          Could not generate cover letter. Check backend or OpenAI API key.
        </p>
      )}

      {matchResult && <MatchReport matchResult={matchResult} />}

      {job.id && coverLetter && (
        <CoverLetterPanel
          content={editedLetter ?? coverLetter.content}
          isSaving={isSaving}
          isDeleting={isDeleting}
          onChange={(content) => onEditLetter(job.id!, content)}
          onSave={() => onSaveLetter(job.id!)}
          onDelete={() => {
            const confirmed = window.confirm(
              "Are you sure you want to delete this cover letter?",
            );

            if (confirmed) {
              onDeleteLetter(job.id!);
            }
          }}
        />
      )}
    </article>
  );
}

export default JobCard;