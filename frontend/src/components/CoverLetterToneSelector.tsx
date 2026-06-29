interface CoverLetterToneSelectorProps {
  tone: string;
  onToneChange: (tone: string) => void;
}

function CoverLetterToneSelector({
  tone,
  onToneChange,
}: CoverLetterToneSelectorProps) {
  return (
    <select
      value={tone}
      onChange={(e) => onToneChange(e.target.value)}
      style={{
        width: "100%",
        padding: "10px 12px",
        border: "1px solid #dcdcdc",
        borderRadius: "8px",
        background: "#fff",
        fontSize: "14px",
        fontFamily: "inherit",
        cursor: "pointer",
        boxSizing: "border-box",
      }}
    >
      <option>Professional</option>
      <option>Concise</option>
      <option>Technical</option>
      <option>Friendly</option>
    </select>
  );
}

export default CoverLetterToneSelector;