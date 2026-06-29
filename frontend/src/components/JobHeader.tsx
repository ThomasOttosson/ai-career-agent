interface JobHeaderProps {
  title: string;
  company: string;
  location: string;
  workMode: string;
  description: string;
}

function JobHeader({
  title,
  company,
  location,
  workMode,
  description,
}: JobHeaderProps) {
  return (
    <section style={{ marginBottom: "12px" }}>
      <h3
        style={{
          margin: "0 0 8px",
          fontSize: "20px",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#666",
          margin: "0 0 10px",
          fontSize: "14px",
        }}
      >
        🏢 {company} · 📍 {location} · 💻 {workMode}
      </p>

      <p
        style={{
          lineHeight: "1.5",
          margin: 0,
        }}
      >
        {description}
      </p>
    </section>
  );
}

export default JobHeader;