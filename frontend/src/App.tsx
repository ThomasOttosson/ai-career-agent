import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useCoverLetters } from "./hooks/useCoverLetters";
import { useJobMatches } from "./hooks/useJobMatches";
import { useApplicationCases } from "./hooks/useApplicationCases";
import { useJobs } from "./hooks/useJobs";
import { useAuth } from "./hooks/useAuth";
import { useProfile } from "./hooks/useProfile";
import "./App.css";
import AuthBar from "./components/AuthBar";
import AuthModal from "./components/AuthModal";
import Sidebar from "./components/Sidebar";
import JobsPage from "./pages/JobsPage";
import ApplicationsPage from "./pages/ApplicationsPage";
import CoverLettersPage from "./pages/CoverLettersPage";
import CoverLetterEditorPage from "./pages/CoverLetterEditorPage";
import SettingsPage from "./pages/SettingsPage";
import AiMatchPage from "./pages/AiMatchPage";
import DashboardPage from "./pages/DashboardPage";
import ResumeBuilderPage from "./pages/ResumeBuilderPage";
import CareerCoachPage from "./pages/CareerCoachPage";
import type { JobPosting } from "./api/jobApi";

function App() {
  const auth = useAuth();
  const location = useLocation();
  const currentUserId = auth.user?.userId;
  const { profile } = useProfile(currentUserId);
  const [authMode, setAuthMode] = useState<"login" | "register" | null>(null);

  useEffect(() => {
    auth.clearMessage();
  }, [location.pathname]);

  const clearAuthMessage = () => {
    if (auth.message) {
      auth.clearMessage();
    }
  };

  const [sidebarOpen, setSidebarOpen] = useState(() => {
    return localStorage.getItem("sidebar-open") !== "false";
  });

  const [showWelcome, setShowWelcome] = useState(() => {
    return localStorage.getItem("welcome-dismissed") !== "true";
  });

  const [job, setJob] = useState<JobPosting>({
    title: "",
    company: "",
    location: "",
    workMode: "Remote",
    description: "",
  });

  const [coverLetterTone, setCoverLetterTone] = useState("Professional");

  const { jobs, createJobMutation } = useJobs(currentUserId);

  const {
    applicationCases,
    createCaseMutation,
    approveCaseMutation,
    readyCaseMutation,
    appliedCaseMutation,
    interviewCaseMutation,
    offerCaseMutation,
    hiredCaseMutation,
    rejectedCaseMutation,
    deleteCaseMutation,
    updateCaseMutation,
  } = useApplicationCases(currentUserId);

  const { matchResults, analyzeMutation, deleteMatchResult } = useJobMatches(currentUserId);

  const {
    coverLetters,
    manualCoverLetters,
    editedLetters,
    editLetter,
    generateMutation,
    updateMutation,
    createManualMutation,
    deleteMutation,
    saveEditedLetter,
    removeLetter,
    createManualLetter,
    updateManualLetter,
    removeManualLetter,
  } = useCoverLetters(jobs, currentUserId);

  const hasSavedProfile = Boolean(profile);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    clearAuthMessage();

    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthMessage();

    createJobMutation.mutate(job, {
      onSuccess: () => {
        setJob({
          title: "",
          company: "",
          location: "",
          workMode: "Remote",
          description: "",
        });
      },
    });
  };

  const toggleSidebar = () => {
    clearAuthMessage();

    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-open", String(next));
      return next;
    });
  };

  const dismissWelcome = () => {
    clearAuthMessage();

    localStorage.setItem("welcome-dismissed", "true");
    setShowWelcome(false);
  };

  return (
    <>
      <Sidebar
        userEmail={auth.user?.email}
        isLoggedIn={auth.isLoggedIn}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />

      <main
        onClick={(event) => {
          const target = event.target as HTMLElement;

          if (
            target.closest("button") ||
            target.closest("input") ||
            target.closest("textarea") ||
            target.closest("select") ||
            target.closest("a")
          ) {
            clearAuthMessage();
          }
        }}
        onInput={clearAuthMessage}
        style={{
          maxWidth: "1050px",
          marginLeft: sidebarOpen ? "280px" : "80px",
          padding: "28px",
          transition: "margin-left 0.3s ease",
        }}
      >
        <AuthBar
          userEmail={auth.user?.email}
          isLoggedIn={auth.isLoggedIn}
          onLoginClick={() => {
            auth.clearMessage();
            setAuthMode("login");
          }}
          onRegisterClick={() => {
            auth.clearMessage();
            setAuthMode("register");
          }}
          onLogout={() => {
            auth.clearMessage();
            auth.logout();
          }}
        />

        {authMode && (
          <AuthModal
            mode={authMode}
            onClose={() => setAuthMode(null)}
            onSubmit={async (email, password) => {
              if (authMode === "login") {
                await auth.login(email, password);
              } else {
                await auth.register(email, password);
              }

              dismissWelcome();
            }}
          />
        )}

        {auth.message && (
          <div
            style={{
              position: "relative",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "10px 38px 10px 12px",
              marginBottom: "16px",
              background: "#f8f9fa",
              fontSize: "14px",
            }}
          >
            {auth.message}

            <button
              type="button"
              onClick={auth.clearMessage}
              aria-label="Close message"
              style={{
                position: "absolute",
                top: "8px",
                right: "10px",
                border: "none",
                background: "transparent",
                fontSize: "18px",
                lineHeight: "1",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        )}

        {!auth.isLoggedIn && showWelcome && (
          <section
            style={{
              position: "relative",
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "24px",
              background: "#fff",
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <button
              type="button"
              onClick={dismissWelcome}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                border: "none",
                background: "transparent",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            <h2>Welcome to AI Career Agent</h2>
            <p>
              Browse available jobs freely. Login or register to use AI
              analysis, generate cover letters, and manage applications.
            </p>
          </section>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <DashboardPage
                jobs={jobs}
                matchResults={matchResults}
                coverLetters={coverLetters}
                applicationCases={applicationCases}
                isAiWorking={
                  analyzeMutation.isPending || generateMutation.isPending
                }
                job={job}
                isSavingJob={createJobMutation.isPending}
                canUseApp={auth.isLoggedIn}
                onJobChange={handleChange}
                onJobSubmit={handleSubmit}
              />
            }
          />

          <Route
            path="/jobs"
            element={
              <JobsPage
                jobs={jobs}
                applicationCases={applicationCases}
                matchResults={matchResults}
                coverLetters={coverLetters}
                editedLetters={editedLetters}
                coverLetterTone={coverLetterTone}
                canUseApp={auth.isLoggedIn}
                hasSavedProfile={hasSavedProfile}
                isAnalyzing={analyzeMutation.isPending}
                isGenerating={generateMutation.isPending}
                isSaving={updateMutation.isPending}
                hasAnalyzeError={analyzeMutation.isError}
                hasCoverLetterError={generateMutation.isError}
                onToneChange={(tone) => {
                  clearAuthMessage();
                  setCoverLetterTone(tone);
                }}
                onAnalyze={(jobId) => {
                  clearAuthMessage();
                  analyzeMutation.mutate(jobId);
                }}
                onGenerateCoverLetter={(jobId, tone) => {
                  clearAuthMessage();
                  generateMutation.mutate({ jobId, tone });
                }}
                onCreateCase={(jobId) => {
                  clearAuthMessage();
                  createCaseMutation.mutate(jobId);
                }}
                onEditLetter={(letterId, content) => {
                  clearAuthMessage();
                  editLetter(letterId, content);
                }}
                onSaveLetter={(letterId) => {
                  clearAuthMessage();
                  saveEditedLetter(letterId);
                }}
                isDeleting={deleteMutation.isPending}
                onDeleteLetter={(letterId) => {
                  clearAuthMessage();
                  removeLetter(letterId);
                }}
              />
            }
          />

          <Route
            path="/ai-match"
            element={
              <AiMatchPage
                jobs={jobs}
                matchResults={matchResults}
                onDeleteMatch={(matchId) => {
                  clearAuthMessage();
                  deleteMatchResult(matchId);
                }}
              />
            }
          />

          <Route
            path="/cover-letters"
            element={
              <CoverLettersPage
                jobs={jobs}
                coverLetters={coverLetters}
                manualCoverLetters={manualCoverLetters}
                editedLetters={editedLetters}
                onEditLetter={(letterId, content) => {
                  clearAuthMessage();
                  editLetter(letterId, content);
                }}
                onSaveLetter={(letterId) => {
                  clearAuthMessage();
                  saveEditedLetter(letterId);
                }}
                onDeleteLetter={(letterId) => {
                  clearAuthMessage();
                  removeLetter(letterId);
                }}
                onCreateManualLetter={(title, company, content) => {
                  clearAuthMessage();
                  createManualLetter(title, company, content);
                }}
                onUpdateManualLetter={(letterId, title, company, content) => {
                  clearAuthMessage();
                  updateManualLetter(letterId, title, company, content);
                }}
                onDeleteManualLetter={(letterId) => {
                  clearAuthMessage();
                  removeManualLetter(letterId);
                }}
                isSaving={updateMutation.isPending}
                isDeleting={deleteMutation.isPending}
                isCreating={createManualMutation.isPending}
              />
            }
          />

          <Route
            path="/cover-letters/:coverLetterId"
            element={
              <CoverLetterEditorPage
                jobs={jobs}
                coverLetters={coverLetters}
                manualCoverLetters={manualCoverLetters}
                onUpdateCoverLetter={(letterId, title, company, content) => {
                  clearAuthMessage();
                  updateManualLetter(letterId, title, company, content);
                }}
                isSaving={updateMutation.isPending}
              />
            }
          />

          <Route path="/resume" element={<ResumeBuilderPage />} />

          <Route
            path="/career-coach"
            element={
              <CareerCoachPage
                jobs={jobs}
                coverLetters={coverLetters}
                applicationCases={applicationCases}
              />
            }
          />

          <Route
            path="/applications"
            element={
              <ApplicationsPage
                isLoggedIn={auth.isLoggedIn}
                jobs={jobs}
                applicationCases={applicationCases}
                coverLetters={coverLetters}
                onApprove={(caseId) => {
                  clearAuthMessage();
                  approveCaseMutation.mutate(caseId);
                }}
                onReady={(caseId) => {
                  clearAuthMessage();
                  readyCaseMutation.mutate(caseId);
                }}
                onApplied={(caseId) => {
                  clearAuthMessage();
                  appliedCaseMutation.mutate(caseId);
                }}
                onInterview={(caseId) => {
                  clearAuthMessage();
                  interviewCaseMutation.mutate(caseId);
                }}
                onOffer={(caseId) => {
                  clearAuthMessage();
                  offerCaseMutation.mutate(caseId);
                }}
                onHired={(caseId) => {
                  clearAuthMessage();
                  hiredCaseMutation.mutate(caseId);
                }}
                onRejected={(caseId) => {
                  clearAuthMessage();
                  rejectedCaseMutation.mutate(caseId);
                }}
                onDelete={(caseId) => {
                  clearAuthMessage();
                  deleteCaseMutation.mutate(caseId);
                }}
                onUpdate={(caseId, status, notes, followUpDate) => {
                  clearAuthMessage();
                  updateCaseMutation.mutate({
                    caseId,
                    status,
                    notes,
                    followUpDate,
                  });
                }}
              />
            }
          />

          <Route
            path="/settings"
            element={
              <SettingsPage
                isLoggedIn={auth.isLoggedIn}
                userEmail={auth.user?.email}
                userId={currentUserId}
              />
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default App;