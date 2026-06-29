import type { JobPosting } from "../api/jobApi";

interface JobFormProps {
  job: JobPosting;
  isSaving: boolean;
  canUseApp: boolean;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

function JobForm({
  job,
  isSaving,
  canUseApp,
  onChange,
  onSubmit,
}: JobFormProps) {
  return (
    <>
      {!canUseApp && (
        <div
          style={{
            background: "#fff3cd",
            color: "#856404",
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
            fontSize: "14px",
          }}
        >
          🔒 Login or register to add job postings.
        </div>
      )}

      <form className="job-form" onSubmit={onSubmit}>
        <label className="job-field">
          Job title
          <input
            name="title"
            placeholder="Job title"
            value={job.title}
            onChange={onChange}
            disabled={!canUseApp}
          />
        </label>

        <label className="job-field">
          Company
          <input
            name="company"
            placeholder="Company"
            value={job.company}
            onChange={onChange}
            disabled={!canUseApp}
          />
        </label>

        <label className="job-field">
          Location
          <input
            name="location"
            placeholder="Location"
            value={job.location}
            onChange={onChange}
            disabled={!canUseApp}
          />
        </label>

        <label className="job-field">
          Work mode
          <select
            name="workMode"
            value={job.workMode}
            onChange={onChange}
            disabled={!canUseApp}
          >
            <option>Remote</option>
            <option>Hybrid</option>
            <option>Onsite</option>
          </select>
        </label>

        <label className="job-field">
          Description
          <textarea
            name="description"
            placeholder="Paste job description here..."
            value={job.description}
            onChange={onChange}
            rows={6}
            disabled={!canUseApp}
          />
        </label>

        <button
          className="job-submit"
          type="submit"
          disabled={!canUseApp || isSaving}
        >
          {isSaving ? "Saving job..." : "Add job posting"}
        </button>
      </form>
    </>
  );
}

export default JobForm;