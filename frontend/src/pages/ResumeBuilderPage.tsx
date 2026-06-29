import { useEffect, useMemo, useState } from "react";
import { rewriteResumeWithAi, type ResumeAiAction } from "../api/jobApi";

type ResumeData = {
  fullName: string;
  title: string;
  email: string;
  location: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
  profileImage: string;
};

const STORAGE_KEY = "ai-career-agent-resume";

const emptyResume: ResumeData = {
  fullName: "",
  title: "",
  email: "",
  location: "",
  summary: "",
  experience: "",
  education: "",
  skills: "",
  projects: "",
  profileImage: "",
};

function loadResume() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return emptyResume;

  try {
    return {
      ...emptyResume,
      ...(JSON.parse(saved) as Partial<ResumeData>),
    };
  } catch {
    return emptyResume;
  }
}

function resumeToText(resume: ResumeData) {
  return `
${resume.fullName}
${resume.title}
${resume.email}
${resume.location}

Summary
${resume.summary}

Experience
${resume.experience}

Education
${resume.education}

Skills
${resume.skills}

Projects
${resume.projects}
`.trim();
}

function ResumeBuilderPage() {
  const [resume, setResume] = useState<ResumeData>(() => loadResume());
  const [savedMessage, setSavedMessage] = useState(false);
  const [isAiWorking, setIsAiWorking] = useState(false);
  const [aiResult, setAiResult] = useState("");

  const wordCount = useMemo(() => {
    const text = Object.values(resume).join(" ").trim();
    return text ? text.split(/\s+/).length : 0;
  }, [resume]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
  }, [resume]);

  const updateField = (field: keyof ResumeData, value: string) => {
    setResume((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      updateField("profileImage", String(reader.result));
    };

    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => {
    updateField("profileImage", "");
  };

  const saveResume = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resume));
    setSavedMessage(true);

    setTimeout(() => {
      setSavedMessage(false);
    }, 2500);
  };

  const exportPdf = () => {
    window.print();
  };

  const clearResume = () => {
    const shouldClear = window.confirm("Clear your resume?");

    if (!shouldClear) return;

    setResume(emptyResume);
    setAiResult("");
    localStorage.removeItem(STORAGE_KEY);
  };

  const runAiTool = async (action: ResumeAiAction) => {
    const resumeText = resumeToText(resume);

    if (!resumeText.trim()) {
      alert("Write your resume first.");
      return;
    }

    try {
      setIsAiWorking(true);

      const rewritten = await rewriteResumeWithAi({
        resume: resumeText,
        action,
      });

      setAiResult(rewritten);
    } catch {
      alert("Could not improve resume with AI.");
    } finally {
      setIsAiWorking(false);
    }
  };

  return (
    <section>
      <div className="resume-builder-header">
        <div>
          <h2 style={{ marginBottom: "4px" }}>Resume Builder(Demo Version)</h2>
          <p style={{ margin: 0, color: "#666" }}>
            Build, edit, improve and export your resume.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button type="button" className="primary-button" onClick={saveResume}>
            Save resume
          </button>

          <button type="button" className="primary-button" onClick={exportPdf}>
            Export PDF
          </button>
        </div>
      </div>

      {savedMessage && (
        <p style={{ color: "green", fontSize: "14px" }}>
          ✅ Resume saved successfully.
        </p>
      )}

      <div className="resume-builder-layout">
        <article className="resume-editor-card">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 170px",
              gap: "20px",
              alignItems: "start",
              marginBottom: "22px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <label className="resume-field">
                Full name
                <input
                  value={resume.fullName}
                  onChange={(event) =>
                    updateField("fullName", event.target.value)
                  }
                  placeholder="E.g. John Doe"
                />
              </label>

              <label className="resume-field">
                Professional title
                <input
                  value={resume.title}
                  onChange={(event) => updateField("title", event.target.value)}
                  placeholder="E.g. Frontend Developer"
                />
              </label>

              <label className="resume-field">
                Email
                <input
                  value={resume.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  placeholder="E.g. name@email.com"
                />
              </label>

              <label className="resume-field">
                Location
                <input
                  value={resume.location}
                  onChange={(event) =>
                    updateField("location", event.target.value)
                  }
                  placeholder="E.g. London, England"
                />
              </label>
            </div>

            <div style={{ width: "170px" }}>
              <label
                htmlFor="resume-profile-image"
                className="cover-letter-create-card"
                style={{
                  width: "170px",
                  height: "170px",
                  padding: "10px",
                  display: "grid",
                  placeItems: "center",
                  cursor: "pointer",
                  boxSizing: "border-box",
                }}
              >
                {resume.profileImage ? (
                  <img
                    src={resume.profileImage}
                    alt="Resume profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  <span className="cover-letter-plus">+</span>
                )}
              </label>

              <input
                id="resume-profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />

              <div className="cover-letter-card-meta">
                <strong>Profile photo</strong>
                <p>{resume.profileImage ? "Click to change" : "Upload image"}</p>
              </div>

              {resume.profileImage && (
                <button
                  type="button"
                  className="danger-button"
                  onClick={removeProfileImage}
                  style={{ width: "100%", marginTop: "8px" }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <div className="resume-editor-grid">
            <label className="resume-field resume-field-full">
              Summary
              <textarea
                rows={5}
                value={resume.summary}
                onChange={(event) => updateField("summary", event.target.value)}
                placeholder="Write a short professional summary..."
              />
            </label>

            <label className="resume-field resume-field-full">
              Experience
              <textarea
                rows={8}
                value={resume.experience}
                onChange={(event) =>
                  updateField("experience", event.target.value)
                }
                placeholder={
                  "Company · Role · Dates\n- Achievement\n- Achievement"
                }
              />
            </label>

            <label className="resume-field resume-field-full">
              Education
              <textarea
                rows={5}
                value={resume.education}
                onChange={(event) =>
                  updateField("education", event.target.value)
                }
                placeholder="School · Program · Dates"
              />
            </label>

            <label className="resume-field resume-field-full">
              Skills
              <textarea
                rows={4}
                value={resume.skills}
                onChange={(event) => updateField("skills", event.target.value)}
                placeholder="React, TypeScript, Java, Spring Boot..."
              />
            </label>

            <label className="resume-field resume-field-full">
              Projects
              <textarea
                rows={6}
                value={resume.projects}
                onChange={(event) =>
                  updateField("projects", event.target.value)
                }
                placeholder={
                  "Project name\n- What you built\n- Technologies used"
                }
              />
            </label>
          </div>

          <div className="resume-editor-footer">
            <span>Words: {wordCount}</span>

            <button
              type="button"
              className="danger-button"
              onClick={clearResume}
            >
              Clear resume
            </button>
          </div>
        </article>

        <aside className="resume-preview-card">
          <h3 style={{ marginTop: 0 }}>AI Tools</h3>

          <div style={{ display: "grid", gap: "8px", marginBottom: "16px" }}>
            <button
              type="button"
              className="primary-button"
              disabled={isAiWorking}
              onClick={() => runAiTool("IMPROVE")}
            >
              Improve resume
            </button>

            <button
              type="button"
              className="primary-button"
              disabled={isAiWorking}
              onClick={() => runAiTool("ATS")}
            >
              Optimize for ATS
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
              Expand resume
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
              AI is improving your resume...
            </p>
          )}

          {aiResult && (
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: "10px",
                padding: "12px",
                background: "#fafafa",
                whiteSpace: "pre-wrap",
                fontSize: "13px",
                marginBottom: "16px",
              }}
            >
              <strong>AI Result</strong>
              <p>{aiResult}</p>
            </div>
          )}

          <h3>Preview</h3>

          <div className="resume-preview-document">
            {resume.profileImage && (
              <img
                src={resume.profileImage}
                alt="Resume profile"
                style={{
                  width: "82px",
                  height: "82px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "12px",
                }}
              />
            )}

            <h1>{resume.fullName || "Your Name"}</h1>
            <p className="resume-preview-title">
              {resume.title || "Professional Title"}
            </p>

            <p className="resume-preview-contact">
              {[resume.email, resume.location].filter(Boolean).join(" · ")}
            </p>

            {resume.summary && (
              <>
                <h2>Summary</h2>
                <p>{resume.summary}</p>
              </>
            )}

            {resume.experience && (
              <>
                <h2>Experience</h2>
                <p>{resume.experience}</p>
              </>
            )}

            {resume.education && (
              <>
                <h2>Education</h2>
                <p>{resume.education}</p>
              </>
            )}

            {resume.skills && (
              <>
                <h2>Skills</h2>
                <p>{resume.skills}</p>
              </>
            )}

            {resume.projects && (
              <>
                <h2>Projects</h2>
                <p>{resume.projects}</p>
              </>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default ResumeBuilderPage;