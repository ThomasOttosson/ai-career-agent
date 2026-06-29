import logo from "../assets/ai-career-agent-logo.png";

interface AuthBarProps {
  userEmail?: string;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onRegisterClick: () => void;
  onLogout: () => void;
}

function AuthBar({
  userEmail,
  isLoggedIn,
  onLoginClick,
  onRegisterClick,
  onLogout,
}: AuthBarProps) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <img src={logo} alt="AI Career Agent" className="header-logo" />

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {!isLoggedIn ? (
          <>
            <button
              className="login-button"
              type="button"
              onClick={onLoginClick}
            >
              Login
            </button>
            <button
              className="reg-button"
              type="button"
              onClick={onRegisterClick}
            >
              Register
            </button>
          </>
        ) : (
          <>
            <span
              style={{
                padding: "6px 10px",
                border: "1px solid #ddd",
                borderRadius: "999px",
                fontSize: "14px",
                background: "#fff",
              }}
            >
              👤 {userEmail}
            </span>

            <button className="logout-button" onClick={onLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default AuthBar;
