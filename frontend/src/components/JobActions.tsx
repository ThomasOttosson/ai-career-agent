interface JobActionsProps {
  jobId?: string;
  coverLetterTone: string;
  isAnalyzing: boolean;
  isGenerating: boolean;
  canUseApp: boolean;
  onAnalyze: (jobId: string) => void;
  onGenerateCoverLetter: (jobId: string, tone: string) => void;
  onCreateCase: (jobId: string) => void;
}

function JobActions({
  jobId,
  coverLetterTone,
  isAnalyzing,
  isGenerating,
  canUseApp,
  onAnalyze,
  onGenerateCoverLetter,
  onCreateCase,
}: JobActionsProps) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={() => jobId && onAnalyze(jobId)}
        disabled={!canUseApp || isAnalyzing}
        style={{
          opacity: !canUseApp ? 0.5 : 1,
          cursor: !canUseApp ? "not-allowed" : "pointer",
        }}
      >
        {isAnalyzing ? "Analyzing..." : "1. Analyze match"}
      </button>

      <button
        type="button"
        onClick={() => jobId && onGenerateCoverLetter(jobId, coverLetterTone)}
        disabled={!canUseApp || isGenerating}
        style={{
          opacity: !canUseApp ? 0.5 : 1,
          cursor: !canUseApp ? "not-allowed" : "pointer",
        }}
      >
        {isGenerating ? "Generating..." : "2. Generate cover letter"}
      </button>

      <button
        type="button"
        onClick={() => jobId && onCreateCase(jobId)}
        disabled={!canUseApp}
        style={{
          opacity: !canUseApp ? 0.5 : 1,
          cursor: !canUseApp ? "not-allowed" : "pointer",
        }}
      >
        3. Create application case
      </button>
    </div>
  );
}

export default JobActions;