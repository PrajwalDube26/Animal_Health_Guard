import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import "./Navbar.css";

const Navbar = () => {
  const { isAdminLoggedIn, adminLogout } = useContext(AdminContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const success = await adminLogout();
    if (success) {
      navigate("/login");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="admin-navbar">
      <Link to="/" className="admin-nav-brand">
        <span className="admin-brand-icon">🛡️</span>
        <span className="admin-brand-title">Animal Health Guard Admin</span>
      </Link>

      <div className="admin-nav-links">
        {isAdminLoggedIn ? (
          <>
            <Link
              to="/fetchadminalert"
              className={`admin-nav-btn ${isActive("/fetchadminalert") ? "active" : ""}`}
            >
              📋 Alerts
            </Link>
            <Link
              to="/fetchadmintrainingmodule"
              className={`admin-nav-btn ${isActive("/fetchadmintrainingmodule") ? "active" : ""}`}
            >
              🎓 Training
            </Link>
            <Link
              to="/fetchadminbioassig"
              className={`admin-nav-btn ${isActive("/fetchadminbioassig") ? "active" : ""}`}
            >
              🛡️ Biosecurity
            </Link>
            <Link
              to="/profile"
              className={`admin-nav-btn ${isActive("/profile") || isActive("/") ? "active" : ""}`}
            >
              👤 Profile
            </Link>
            <button onClick={handleLogout} className="admin-nav-btn logout-btn">
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`admin-nav-btn primary ${isActive("/login") ? "active" : ""}`}
            >
              🔑 Admin Login
            </Link>
            <Link
              to="/signup"
              className={`admin-nav-btn ${isActive("/signup") ? "active" : ""}`}
            >
              📝 Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
