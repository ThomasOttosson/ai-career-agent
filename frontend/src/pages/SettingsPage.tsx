import { useEffect, useState } from "react";
import ProfileEditor from "../components/ProfileEditor";
import { useProfile } from "../hooks/useProfile";

interface SettingsPageProps {
  isLoggedIn: boolean;
  userEmail?: string;
  userId?: string;
}

function hasText(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

function SettingsPage({ isLoggedIn, userEmail, userId }: SettingsPageProps) {
  const { profile, isLoading, saveProfileMutation } = useProfile(userId);
  const profileSaved = saveProfileMutation.isSuccess;
  const [showProfileSaved, setShowProfileSaved] = useState(false);

  const profileChecks = profile
    ? [
        hasText(profile.fullName),
        hasText(profile.currentTitle),
        hasText(profile.experienceLevel),
        hasText(profile.preferredRole),
        hasText(profile.workMode),
        hasText(profile.desiredSalary),
        Array.isArray(profile.skills) &&
          profile.skills.some((skill) => hasText(skill)),
      ]
    : [];

  const completedFields = profileChecks.filter(Boolean).length;
  const totalFields = profileChecks.length;

  const profileCompleteness =
    totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

  useEffect(() => {
    if (!profileSaved) return;

    setShowProfileSaved(true);

    const timeout = setTimeout(() => {
      setShowProfileSaved(false);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [profileSaved]);

  return (
    <section>
      <h2>Settings</h2>

      <article
        style={{
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "16px",
          background: "#fff",
          marginBottom: "16px",
        }}
      >
        <h3>Account</h3>
        <p>
          <strong>Status:</strong> {isLoggedIn ? "Signed in" : "Guest mode"}
        </p>

        {isLoggedIn && (
          <p>
            <strong>Email:</strong> {userEmail}
          </p>
        )}
      </article>

      {isLoggedIn && (
        <ProfileEditor
          profile={profile ?? undefined}
          isSaving={saveProfileMutation.isPending || isLoading}
          onSave={(profileData) => saveProfileMutation.mutate(profileData)}
        />
      )}

      {showProfileSaved && (
        <p
          style={{
            color: "green",
            fontSize: "14px",
            marginBottom: "16px",
          }}
        >
          ✅ Profile saved successfully.
        </p>
      )}

      {isLoggedIn && profile && (
        <article
          style={{
            border: "1px solid #ddd",
            borderRadius: "12px",
            padding: "16px",
            background: "#fff",
            marginBottom: "16px",
          }}
        >
          <h3>Profile summary</h3>

          <div style={{ marginBottom: "16px" }}>
            <p>
              <strong>Profile completeness:</strong> {profileCompleteness}%
            </p>

            <div
              style={{
                height: "10px",
                background: "#f1f3f5",
                borderRadius: "999px",
                overflow: "hidden",
                border: "1px solid #ddd",
              }}
            >
              <div
                style={{
                  width: `${profileCompleteness}%`,
                  height: "100%",
                  background:
                    profileCompleteness >= 80
                      ? "#2f9e44"
                      : profileCompleteness >= 50
                        ? "#f08c00"
                        : "#e03131",
                }}
              />
            </div>
          </div>

          <p>
            <strong>Name:</strong> {profile.fullName}
          </p>

          <p>
            <strong>Role:</strong> {profile.preferredRole}
          </p>

          <div>
            <strong>Skills:</strong>

            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                marginTop: "8px",
              }}
            >
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    background: "#f1f3f5",
                    border: "1px solid #ddd",
                    borderRadius: "999px",
                    padding: "6px 10px",
                    fontSize: "14px",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </article>
      )}
    </section>
  );
}

export default SettingsPage;