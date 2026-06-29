import { useState } from "react";

interface AuthModalProps {
  mode: "login" | "register";
  onClose: () => void;
  onSubmit: (email: string, password: string) => Promise<void>;
}

function AuthModal({ mode, onClose, onSubmit }: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = mode === "login" ? "Login" : "Register";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit(email, password);
      onClose();
    } catch {
      setError("Authentication failed. Check your email and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-modal">
      <h2>{title}</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label className="auth-field">
          Email
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="auth-field">
          Password
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <div className="auth-actions">
          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Please wait..." : title}
          </button>

          <button className="auth-cancel" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthModal;