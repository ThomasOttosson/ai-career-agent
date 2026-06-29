import { NavLink } from "react-router-dom";
import logoFull from "../assets/ai-career-agent-logo.png";
import logoIcon from "../assets/logo-icon.png";

interface SidebarProps {
  userEmail?: string;
  isLoggedIn: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

function Sidebar({ userEmail, isLoggedIn, isOpen, onToggle }: SidebarProps) {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `sidebar-link ${isActive ? "active" : ""}`;

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="sidebar-toggle" type="button" onClick={onToggle}>
        {isOpen ? "←" : "☰"}
      </button>

      <div>
        <div className="sidebar-logo">
          <img
            src={isOpen ? logoFull : logoIcon}
            alt="AI Career Agent"
            className={isOpen ? "sidebar-logo-image" : "sidebar-logo-icon"}
          />

          {isOpen && <span className="beta-badge">BETA</span>}
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={linkClass}>
            🏠 {isOpen && "Create Job"}
          </NavLink>

          {isOpen && <p className="sidebar-label">FEATURES</p>}

          <NavLink to="/jobs" className={linkClass}>
            💼 {isOpen && "Jobs"}
          </NavLink>

          <NavLink to="/ai-match" className={linkClass}>
            🤖 {isOpen && "AI Match"}
          </NavLink>

          <NavLink to="/cover-letters" className={linkClass}>
            ✍️ {isOpen && "Cover Letters"}
          </NavLink>

          <NavLink to="/resume" className={linkClass}>
            📄 {isOpen && "Resume"}
          </NavLink>

          <NavLink to="/applications" className={linkClass}>
            ✅ {isOpen && "Applications"}
          </NavLink>

          <NavLink to="/career-coach" className={linkClass}>
            🧠 {isOpen && "Career Coach"}
          </NavLink>

          {isOpen && <p className="sidebar-label">SETTINGS</p>}

          <NavLink to="/settings" className={linkClass}>
            ⚙️ {isOpen && "Settings"}
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-user">
        <div className="avatar">
          {isLoggedIn ? userEmail?.charAt(0).toUpperCase() : "?"}
        </div>

        {isOpen && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ fontSize: "14px" }}>
              {isLoggedIn ? userEmail : "Guest mode"}
            </span>

            <span
              style={{
                fontSize: "12px",
                color: "#777",
              }}
            >
              {isLoggedIn ? "Signed in" : "Read-only access"}
            </span>
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;