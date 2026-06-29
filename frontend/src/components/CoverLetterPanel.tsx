import { useState } from "react";
import CoverLetterEditor from "./CoverLetterEditor";

interface CoverLetterPanelProps {
  content: string;
  isSaving: boolean;
  isDeleting: boolean;
  onChange: (content: string) => void;
  onSave: () => void;
  onDelete: () => void;
}

function CoverLetterPanel({
  content,
  isSaving,
  isDeleting,
  onChange,
  onSave,
  onDelete,
}: CoverLetterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        marginTop: "16px",
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        background: "#fafafa",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          background: "#f5f5f5",
          borderBottom: isOpen ? "1px solid #ddd" : "none",
        }}
      >
        <strong>✍️ Cover Letter Generated</strong>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button type="button" onClick={() => setIsOpen((prev) => !prev)}>
            {isOpen ? "Hide ▲" : "Open ▼"}
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            style={{
              color: "crimson",
              borderColor: "crimson",
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {isOpen && (
        <div style={{ padding: "12px" }}>
          <CoverLetterEditor
            content={content}
            isSaving={isSaving}
            onChange={onChange}
            onSave={onSave}
          />
        </div>
      )}
    </div>
  );
}

export default CoverLetterPanel;