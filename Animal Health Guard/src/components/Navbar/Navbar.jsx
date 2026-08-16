import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./Navbar.css";

const Navbar = () => {
  const { isloggedin, Logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const success = await Logout();
    if (success) {
      navigate("/login");
    }
  };

  const isActive = (paths) => {
    if (Array.isArray(paths)) {
      return paths.some((p) => location.pathname.startsWith(p));
    }
    return location.pathname === paths || location.pathname.startsWith(paths + "/");
  };

  return (
    <nav className="user-navbar">
      <Link to="/" className="user-nav-brand">
        <span className="user-brand-icon">🛡️</span>
        <span className="user-brand-title">Animal Health Guard</span>
      </Link>

      <div className="user-nav-links">
        {isloggedin ? (
          <>
            <Link
              to="/getfarm"
              className={`user-nav-btn ${isActive(["/getfarm", "/addfarm", "/getsinglefarm", "/farmassignment"]) ? "active" : ""
                }`}
            >
              🚜 Farms
            </Link>
            <Link
              to="/showallbioassig"
              className={`user-nav-btn ${isActive(["/showallbioassig", "/bioassig", "/biosecurity"]) ? "active" : ""
                }`}
            >
              🛡️ Biosecurity
            </Link>
            <Link
              to="/showallalert"
              className={`user-nav-btn ${isActive(["/showallalert", "/useralert"]) ? "active" : ""
                }`}
            >
              🚨 Alerts
            </Link>
            <Link
              to="/getalltrainingmodule"
              className={`user-nav-btn ${isActive(["/getalltrainingmodule", "/usertraining", "/trainingmodule"]) ? "active" : ""
                }`}
            >
              🎓 Training
            </Link>
            <Link
              to="/profile"
              className={`user-nav-btn ${location.pathname === "/profile" || location.pathname === "/updateuser" ? "active" : ""
                }`}
            >
              👤 Profile
            </Link>
            <button onClick={handleLogout} className="user-nav-btn logout-btn">
              🚪 Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className={`user-nav-btn primary ${location.pathname === "/login" ? "active" : ""}`}
            >
              🔑 Login
            </Link>
            <Link
              to="/signup"
              className={`user-nav-btn ${location.pathname === "/signup" ? "active" : ""}`}
            >
              📝 Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;