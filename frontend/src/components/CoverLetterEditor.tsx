interface CoverLetterEditorProps {
  content: string;
  isSaving: boolean;
  onChange: (content: string) => void;
  onSave: () => void;
}

function CoverLetterEditor({
  content,
  isSaving,
  onChange,
  onSave,
}: CoverLetterEditorProps) {
  return (
    <div
      style={{
        marginTop: "16px",
        padding: "12px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        whiteSpace: "pre-wrap",
      }}
    >
      <h4>Generated Cover Letter</h4>

      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        style={{
          width: "100%",
          padding: "10px",
          boxSizing: "border-box",
          marginTop: "10px",
          borderRadius: "8px",
        }}
      />

      <button type="button" onClick={onSave}>
        {isSaving ? "Saving..." : "Save edits"}
      </button>
    </div>
  );
}

export default CoverLetterEditor;