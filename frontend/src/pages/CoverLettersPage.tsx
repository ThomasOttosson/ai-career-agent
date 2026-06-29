import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { CoverLetter, JobPosting } from "../api/jobApi";

interface CoverLettersPageProps {
  jobs?: JobPosting[];
  coverLetters: Record<string, CoverLetter>;
  manualCoverLetters: CoverLetter[];
  editedLetters: Record<string, string>;
  onEditLetter: (jobId: string, content: string) => void;
  onSaveLetter: (jobId: string) => void;
  onDeleteLetter: (jobId: string) => void;
  onCreateManualLetter: (
    title: string,
    company: string,
    content: string,
  ) => void;
  onUpdateManualLetter: (
    coverLetterId: string,
    title: string,
    company: string,
    content: string,
  ) => void;
  onDeleteManualLetter: (coverLetterId: string) => void;
  isSaving: boolean;
  isDeleting: boolean;
  isCreating: boolean;
}

type LetterCard =
  | {
      type: "generated";
      id: string;
      jobId: string;
      title: string;
      company: string;
      content: string;
      createdAt: string;
    }
  | {
      type: "manual";
      id: string;
      title: string;
      company: string;
      content: string;
      createdAt: string;
    };

function CoverLettersPage({
  jobs = [],
  coverLetters,
  manualCoverLetters,
  editedLetters,
  onDeleteLetter,
  onCreateManualLetter,
  onDeleteManualLetter,
  isDeleting,
  isCreating,
}: CoverLettersPageProps) {
  const navigate = useNavigate();

  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
  const [createEditorOpen, setCreateEditorOpen] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company: "",
    content: "",
  });

  const generatedLetters = useMemo<LetterCard[]>(() => {
    return jobs
      .filter((job) => job.id && coverLetters[job.id])
      .map((job) => {
        const letter = coverLetters[job.id!];

        return {
          type: "generated",
          id: letter.id,
          jobId: job.id!,
          title: letter.title || job.title,
          company: letter.company || job.company,
          content: editedLetters[job.id!] ?? letter.content,
          createdAt: letter.createdAt,
        };
      });
  }, [jobs, coverLetters, editedLetters]);

  const manualLetters = useMemo<LetterCard[]>(() => {
    return manualCoverLetters.map((letter) => ({
      type: "manual",
      id: letter.id,
      title: letter.title || "Untitled cover letter",
      company: letter.company || "",
      content: letter.content,
      createdAt: letter.createdAt,
    }));
  }, [manualCoverLetters]);

  const allLetters = useMemo<LetterCard[]>(() => {
    return [...manualLetters, ...generatedLetters];
  }, [manualLetters, generatedLetters]);

  const selectedLetter = allLetters.find(
    (letter) => letter.id === selectedLetterId,
  );

  const openCreateEditor = () => {
    setSelectedLetterId(null);
    setForm({
      title: "",
      company: "",
      content: "",
    });
    setCreateEditorOpen(true);
  };

  const saveNewLetter = () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert("Title and content are required.");
      return;
    }

    onCreateManualLetter(form.title, form.company, form.content);
    setCreateEditorOpen(false);

    setForm({
      title: "",
      company: "",
      content: "",
    });
  };

  const deleteLetter = (letter: LetterCard) => {
    const shouldDelete = window.confirm("Delete this cover letter?");

    if (!shouldDelete) return;

    if (letter.type === "generated") {
      onDeleteLetter(letter.jobId);
    } else {
      onDeleteManualLetter(letter.id);
    }

    if (selectedLetterId === letter.id) {
      setSelectedLetterId(null);
    }
  };

  return (
    <section>
      <div style={{ marginBottom: "22px" }}>
        <h2 style={{ marginBottom: "4px" }}>Cover Letters</h2>

        <p style={{ margin: 0, color: "#666" }}>
          Create, edit, preview and manage your cover letters.
        </p>
      </div>

      <div className="cover-letter-grid">
        <article className="cover-letter-card">
          <button
            type="button"
            onClick={openCreateEditor}
            className="cover-letter-create-card"
            aria-label="Create new cover letter"
          >
            <span className="cover-letter-plus">+</span>
          </button>

          <div className="cover-letter-card-meta">
            <strong>Blank cover letter</strong>
            <p>Create new</p>
          </div>
        </article>

        {allLetters.map((letter) => (
          <article
            key={`${letter.type}-${letter.id}`}
            className="cover-letter-card"
          >
            <button
              type="button"
              onClick={() => setSelectedLetterId(letter.id)}
              className="cover-letter-preview-card"
            >
              <div className="cover-letter-preview-content">
                <strong>{letter.title}</strong>

                <p className="cover-letter-company">
                  {letter.company || "Custom cover letter"}
                </p>

                <p>{letter.content.slice(0, 430)}</p>
              </div>
            </button>

            <div className="cover-letter-actions">
              <button
                type="button"
                className="cover-letter-action-button"
                onClick={() => navigate(`/cover-letters/${letter.id}`)}
              >
                Edit
              </button>

              <button
                type="button"
                className="cover-letter-action-button danger"
                disabled={isDeleting}
                onClick={() => deleteLetter(letter)}
              >
                Delete
              </button>
            </div>

            <div className="cover-letter-card-meta">
              <strong>{letter.title}</strong>
              <p>{letter.company || "Custom cover letter"}</p>
            </div>
          </article>
        ))}
      </div>

      {allLetters.length === 0 && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            background: "#fff",
          }}
        >
          <p>No cover letters yet. Create your first one.</p>
        </div>
      )}

      {selectedLetter && !createEditorOpen && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            background: "#fff",
            whiteSpace: "pre-wrap",
          }}
        >
          <h3>{selectedLetter.title}</h3>

          <p style={{ color: "#666" }}>
            {selectedLetter.company || "Custom cover letter"}
          </p>

          <p>{selectedLetter.content}</p>
        </div>
      )}

      {createEditorOpen && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "20px",
            background: "#fff",
          }}
        >
          <h3>New cover letter</h3>

          <div style={{ display: "grid", gap: "10px" }}>
            <input
              placeholder="Title"
              value={form.title}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
            />

            <input
              placeholder="Company"
              value={form.company}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  company: event.target.value,
                }))
              }
            />

            <textarea
              placeholder="Write your cover letter..."
              rows={16}
              value={form.content}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  content: event.target.value,
                }))
              }
            />
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
            <button
              type="button"
              className="primary-button"
              disabled={isCreating}
              onClick={saveNewLetter}
            >
              {isCreating ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() => setCreateEditorOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default CoverLettersPage;
