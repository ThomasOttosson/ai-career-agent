import { useEffect, useState } from "react";
import { askCareerCoach } from "../api/jobApi";
import type { JobPosting, CoverLetter } from "../api/jobApi";
import type { ApplicationCase } from "../api/applicationApi";

interface CareerCoachPageProps {
  jobs?: JobPosting[];
  coverLetters?: Record<string, CoverLetter>;
  applicationCases?: ApplicationCase[];
}

type CoachMessage = {
  id: string;
  role: "user" | "coach";
  content: string;
};

const STORAGE_KEY = "ai-career-agent-career-coach-conversation";

function loadConversation(): CoachMessage[] {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return [];

  try {
    return JSON.parse(saved) as CoachMessage[];
  } catch {
    return [];
  }
}

function CareerCoachPage({
  jobs = [],
  coverLetters = {},
  applicationCases = [],
}: CareerCoachPageProps) {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<CoachMessage[]>(() =>
    loadConversation(),
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversation));
  }, [conversation]);

  const resumeContext = localStorage.getItem("ai-career-agent-resume") ?? "";

  const jobsContext = jobs
    .map((job) => `${job.title} at ${job.company} (${job.location})`)
    .join("\n");

  const applicationsContext = applicationCases
    .map((item) => {
      const job = jobs.find((job) => job.id === item.jobId);
      return `${job?.title ?? item.jobId}: ${item.status}`;
    })
    .join("\n");

  const coverLettersContext = Object.values(coverLetters)
    .map((letter) => `${letter.title ?? "Cover letter"}: ${letter.content}`)
    .join("\n\n");

  const profileContext = `
Cover letters:
${coverLettersContext}
`.trim();

  const removeMessage = (messageId: string) => {
    setConversation((current) =>
      current.filter((item) => item.id !== messageId),
    );
  };

  const clearConversation = () => {
    const shouldClear = window.confirm("Clear the whole conversation?");

    if (!shouldClear) return;

    setConversation([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const askCoach = async (question: string) => {
    if (!question.trim()) return;

    const userMessage: CoachMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };

    setConversation((current) => [...current, userMessage]);

    setMessage("");
    setIsLoading(true);

    try {
      const answer = await askCareerCoach({
        message: question,
        profileContext,
        resumeContext,
        jobsContext,
        applicationsContext,
      });

      const coachMessage: CoachMessage = {
        id: crypto.randomUUID(),
        role: "coach",
        content: answer,
      };

      setConversation((current) => [...current, coachMessage]);
    } catch {
      const errorMessage: CoachMessage = {
        id: crypto.randomUUID(),
        role: "coach",
        content: "Sorry, I could not answer right now.",
      };

      setConversation((current) => [...current, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div style={{ marginBottom: "16px" }}>
        <h2 style={{ marginBottom: "4px" }}>Career Coach</h2>

        <p style={{ margin: 0, color: "#666" }}>
          Ask your AI career coach about your resume, jobs, applications and
          interview preparation.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 260px",
          gap: "20px",
        }}
      >
        <article
          style={{
            border: "1px solid #ddd",
            borderRadius: "14px",
            background: "#fff",
            padding: "18px",
            display: "grid",
            gridTemplateRows: "1fr auto",
            height: "520px",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "12px",
              alignContent: "start",
              overflowY: "auto",
              height: "340px",
              paddingRight: "4px",
              marginBottom: "16px",
            }}
          >
            {conversation.length === 0 && (
              <p style={{ color: "#666" }}>
                Start by asking something like: “How can I improve my resume?”
              </p>
            )}

            {conversation.map((item) => (
              <div
                key={item.id}
                className="career-coach-message"
                style={{
                  position: "relative",
                  border: "1px solid #eee",
                  borderRadius: "12px",
                  padding: "12px 40px 12px 12px",
                  background: item.role === "user" ? "#f8f9fa" : "#fff",
                  whiteSpace: "pre-wrap",
                }}
              >
                <button
                  type="button"
                  className="career-coach-message-remove"
                  onClick={() => removeMessage(item.id)}
                  aria-label="Remove message"
                >
                  ×
                </button>

                <strong>{item.role === "user" ? "You" : "Career Coach"}</strong>
                <p style={{ marginBottom: 0 }}>{item.content}</p>
              </div>
            ))}

            {isLoading && (
              <div
                style={{
                  border: "1px solid #eee",
                  borderRadius: "12px",
                  padding: "12px",
                  background: "#fff",
                }}
              >
                <strong>Career Coach</strong>
                <p style={{ marginBottom: 0 }}>Thinking...</p>
              </div>
            )}
          </div>

          <div>
            <textarea
              rows={3}
              value={message}
              placeholder="Ask your career coach..."
              onChange={(event) => setMessage(event.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "12px",
              }}
            />

            <button
              type="button"
              className="primary-button"
              disabled={isLoading || !message.trim()}
              onClick={() => askCoach(message)}
              style={{ marginTop: "10px" }}
            >
              Ask Coach
            </button>
          </div>
        </article>

        <aside
          style={{
            border: "1px solid #ddd",
            borderRadius: "14px",
            background: "#fff",
            padding: "16px",
            height: "fit-content",
          }}
        >
          <h3 style={{ marginTop: 0 }}>Quick prompts</h3>

          <div style={{ display: "grid", gap: "8px" }}>
            {[
              "How can I improve my resume?",
              "Which saved job fits me best?",
              "Prepare me for an interview.",
              "What should I improve before applying?",
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="primary-button"
                onClick={() => askCoach(prompt)}
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>

          {conversation.length > 0 && (
            <button
              type="button"
              className="danger-button"
              onClick={clearConversation}
              style={{
                marginTop: "18px",
                width: "100%",
              }}
            >
              Clear conversation
            </button>
          )}
        </aside>
      </div>
    </section>
  );
}

export default CareerCoachPage;
