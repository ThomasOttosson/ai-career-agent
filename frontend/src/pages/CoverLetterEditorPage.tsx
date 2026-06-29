import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  rewriteCoverLetterWithAi,
  type CoverLetter,
  type CoverLetterAiAction,
  type JobPosting,
} from "../api/jobApi";

interface CoverLetterEditorPageProps {
  jobs?: JobPosting[];
  coverLetters: Record<string, CoverLetter>;
  manualCoverLetters: CoverLetter[];
  onUpdateCoverLetter: (
    coverLetterId: string,
    title: string,
    company: string,
    content: string,
  ) => void;
  isSaving: boolean;
}

function CoverLetterEditorPage({
  jobs = [],
  coverLetters,
  manualCoverLetters,
  onUpdateCoverLetter,
  isSaving,
}: CoverLetterEditorPageProps) {
  const { coverLetterId } = useParams();
  const navigate = useNavigate();
  const [isAiWorking, setIsAiWorking] = useState(false);

  const letter = useMemo(() => {
    const generatedLetter = jobs
      .filter((job) => job.id && coverLetters[job.id])
      .map((job) => {
        const coverLetter = coverLetters[job.id!];

        return {
          ...coverLetter,
          title: coverLetter.title || job.title,
          company: coverLetter.company || job.company,
        };
      })
      .find((item) => item.id === coverLetterId);

    if (generatedLetter) return generatedLetter;

    return manualCoverLetters.find((item) => item.id === coverLetterId);
  }, [coverLetterId, jobs, coverLetters, manualCoverLetters]);

  const [title, setTitle] = useState(letter?.title ?? "");
  const [company, setCompany] = useState(letter?.company ?? "");
  const [content, setContent] = useState(letter?.content ?? "");

  if (!letter) {
    return (
      <section>
        <Link to="/cover-letters">← Back to Cover Letters</Link>
        <h2>Cover letter not found</h2>
      </section>
    );
  }

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  const save = () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }

    onUpdateCoverLetter(letter.id, title, company, content);
    navigate("/cover-letters");
  };

  const exportPdf = () => {
    window.print();
  };

  const runAiTool = async (action: CoverLetterAiAction) => {
    if (!content.trim()) {
      alert("Write or generate a cover letter first.");
      return;
    }

    try {
      setIsAiWorking(true);

      const rewritten = await rewriteCoverLetterWithAi({
        content,
        action,
      });

      setContent(rewritten);
    } catch {
      alert("Could not rewrite cover letter with AI.");
    } finally {
      setIsAiWorking(false);
    }
  };

  return (
    <section>
      <Link to="/cover-letters" className="cover-letter-editor-back-link">
        ← Back to Cover Letters
      </Link>

      <div className="cover-letter-editor-header">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="cover-letter-editor-title"
        />

        <input
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          placeholder="Company"
          className="cover-letter-editor-company"
        />
      </div>

      <div className="cover-letter-editor-layout">
        <article className="cover-letter-editor-document">
          <h3 style={{ marginTop: 0 }}>Cover Letter</h3>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={24}
            className="cover-letter-editor-textarea"
          />

          <div className="cover-letter-editor-footer">
            <span className="cover-letter-editor-count">
              Words: {wordCount} · Characters: {content.length}
            </span>

            <button
              type="button"
              className="primary-button"
              disabled={isSaving}
              onClick={save}
            >
              {isSaving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </article>

        <aside className="cover-letter-editor-tools">
          <h3 style={{ marginTop: 0 }}>AI Tools</h3>

          <div style={{ display: "grid", gap: "8px" }}>
            <button
              type="button"
              className="primary-button"
              disabled={isAiWorking}
              onClick={() => runAiTool("IMPROVE")}
            >
              Improve writing
            </button>

            <button
              type="button"
              className="primary-button"
              disabled={isAiWorking}
              onClick={() => runAiTool("PROFESSIONAL")}
            >
              Professional tone
            </button>

            <button
              type="button"
              className="primary-button"
              disabled={isAiWorking}
              onClick={() => runAiTool("FRIENDLY")}
            >
              Friendly tone
            </button>

            <button
              type="button"
              className="primary-button"
              disabled={isAiWorking}
              onClick={() => runAiTool("SHORTER")}
            >
              Make shorter
            </button>

            <button
              type="button"
              className="primary-button"
              disabled={isAiWorking}
              onClick={() => runAiTool("LONGER")}
            >
              Make longer
            </button>

            <button
              type="button"
              className="primary-button"
              disabled={isAiWorking}
              onClick={() => runAiTool("GRAMMAR")}
            >
              Fix grammar
            </button>
          </div>

          {isAiWorking && (
            <p style={{ color: "#666", fontSize: "14px" }}>
              AI is rewriting your cover letter...
            </p>
          )}

          <hr style={{ margin: "16px 0" }} />

          <button
            type="button"
            className="primary-button"
            style={{ width: "100%" }}
            onClick={exportPdf}
          >
            Export PDF
          </button>
        </aside>
      </div>
    </section>
  );
}

export default CoverLetterEditorPage;