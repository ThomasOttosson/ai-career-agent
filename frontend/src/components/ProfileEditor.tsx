import { useEffect, useState } from "react";
import type { UserProfile } from "../api/profileApi";

interface ProfileEditorProps {
  profile?: UserProfile;
  isSaving: boolean;
  onSave: (profile: UserProfile) => void;
}

const emptyProfile: UserProfile = {
  fullName: "",
  currentTitle: "",
  experienceLevel: "Junior",
  skills: [],
  preferredRole: "",
  workMode: "Remote",
  desiredSalary: "",
};

function ProfileEditor({ profile, isSaving, onSave }: ProfileEditorProps) {
  const [form, setForm] = useState<UserProfile>(profile ?? emptyProfile);
  const [skillsText, setSkillsText] = useState(
    (profile?.skills ?? []).join(", "),
  );
  const [otherExperienceInfo, setOtherExperienceInfo] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!profile) return;

    const isSavedOtherExperience = profile.experienceLevel.startsWith("Other - ");

    setForm({
      ...profile,
      experienceLevel: isSavedOtherExperience ? "Other" : profile.experienceLevel,
      desiredSalary: String(profile.desiredSalary ?? ""),
    });

    setOtherExperienceInfo(
      isSavedOtherExperience
        ? profile.experienceLevel.replace("Other - ", "")
        : "",
    );

    setSkillsText(profile.skills.join(", "));
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "experienceLevel" && value !== "Other") {
      setOtherExperienceInfo("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const skills = skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (!form.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.preferredRole.trim()) {
      setError("Please enter your preferred role.");
      return;
    }

    if (skills.length === 0) {
      setError("Please add at least one skill.");
      return;
    }

    const experienceLevel =
      form.experienceLevel === "Other" && otherExperienceInfo.trim()
        ? `Other - ${otherExperienceInfo.trim()}`
        : form.experienceLevel;

    onSave({
      ...form,
      experienceLevel,
      skills,
    });
  };

  const isOtherExperience = form.experienceLevel === "Other";

  return (
    <article
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "12px",
        background: "#fff",
        marginBottom: "12px",
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <h3 style={{ margin: "0 0 4px" }}>Profile</h3>

        <p style={{ color: "#666", fontSize: "13px", margin: 0 }}>
          Used by the AI agent when analyzing jobs and generating cover letters.
        </p>
      </div>

      <form className="profile-form compact-profile-form" onSubmit={handleSubmit}>
        <label className="profile-field">
          Full name
          <input
            name="fullName"
            placeholder="Full name"
            value={form.fullName}
            onChange={handleChange}
          />
        </label>

        <label className="profile-field">
          Current title
          <input
            name="currentTitle"
            placeholder="Current title"
            value={form.currentTitle}
            onChange={handleChange}
          />
        </label>

        <label className="profile-field">
          Experience level
          <select
            name="experienceLevel"
            value={form.experienceLevel}
            onChange={handleChange}
          >
            <option>Student</option>
            <option>Junior</option>
            <option>Mid-level</option>
            <option>Senior</option>
            <option>Other</option>
          </select>
        </label>

        <label className="profile-field">
          Preferred role
          <input
            name="preferredRole"
            placeholder="Preferred role"
            value={form.preferredRole}
            onChange={handleChange}
          />
        </label>

        {isOtherExperience && (
          <label className="profile-field profile-field-full">
            Additional experience information optional
            <input
              type="text"
              placeholder="Example: Career changer, self-taught developer, entrepreneur, bootcamp graduate..."
              value={otherExperienceInfo}
              onChange={(e) => setOtherExperienceInfo(e.target.value)}
            />
          </label>
        )}

        <label className="profile-field">
          Work mode
          <select name="workMode" value={form.workMode} onChange={handleChange}>
            <option>Remote</option>
            <option>Hybrid</option>
            <option>Onsite</option>
          </select>
        </label>

        <label className="profile-field">
          Desired salary
          <input
            name="desiredSalary"
            type="text"
            placeholder="e.g. 100 000 EUR annually"
            value={form.desiredSalary}
            onChange={handleChange}
          />
        </label>

        <label className="profile-field profile-field-full">
          Skills
          <input
            placeholder="Skills, comma separated"
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
          />
        </label>

        {error && (
          <p
            className="profile-field-full"
            style={{ color: "crimson", fontSize: "13px", margin: 0 }}
          >
            {error}
          </p>
        )}

        <button
          className="profile-submit profile-field-full"
          type="submit"
          disabled={isSaving}
        >
          {isSaving ? "Saving profile..." : "Save profile"}
        </button>
      </form>
    </article>
  );
}

export default ProfileEditor;