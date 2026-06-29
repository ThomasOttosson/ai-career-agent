import Dashboard from "../components/Dashboard";
import JobForm from "../components/JobForm";
import type { CoverLetter, JobMatchResult, JobPosting } from "../api/jobApi";
import type { ApplicationCase } from "../api/applicationApi";

interface DashboardPageProps {
  jobs?: JobPosting[];
  matchResults: Record<string, JobMatchResult>;
  coverLetters: Record<string, CoverLetter>;
  applicationCases?: ApplicationCase[];
  isAiWorking: boolean;
  job: JobPosting;
  isSavingJob: boolean;
  canUseApp: boolean;
  onJobChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onJobSubmit: (e: React.FormEvent) => void;
}

function DashboardPage({
  jobs,
  matchResults,
  coverLetters,
  applicationCases,
  isAiWorking,
  job,
  isSavingJob,
  canUseApp,
  onJobChange,
  onJobSubmit,
}: DashboardPageProps) {
  return (
    <>
      <Dashboard
        jobs={jobs}
        matchResults={matchResults}
        coverLetters={coverLetters}
        applicationCases={applicationCases}
        isAiWorking={isAiWorking}
      />

      <section
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "16px",
          background: "#fff",
          marginBottom: "20px",
        }}
      >
        <h2>Next action</h2>
        <p>
          Add a job posting, then go to Jobs to analyze the match and generate a
          cover letter.
        </p>
      </section>

      {!canUseApp && (
        <section
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            background: "#fff",
            marginBottom: "20px",
          }}
        >
          <strong>Guest mode</strong>
          <p style={{ marginBottom: 0 }}>
            You can browse jobs, but you need to login or register to add jobs
            and use AI features.
          </p>
        </section>
      )}

      <JobForm
        job={job}
        isSaving={isSavingJob}
        canUseApp={canUseApp}
        onChange={onJobChange}
        onSubmit={onJobSubmit}
      />
    </>
  );
}

export default DashboardPage;
