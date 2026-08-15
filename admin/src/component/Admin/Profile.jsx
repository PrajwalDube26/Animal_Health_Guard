import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import Featchadmin from "./Featchadmin";
import "./featchadmin.css";

const Profile = () => {
  const { isAdminLoggedIn } = useContext(AdminContext);

  return (
    <>
      {isAdminLoggedIn ? (
        <Featchadmin />
      ) : (
        <div className="login-message">
          <div className="login-message-card">
            <h2>Admin Authentication Required</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", marginTop: "0.5rem" }}>
              Please login or create an administrative account to access this portal.
            </p>
            <div className="login-message-btns">
              <Link to="/login" className="login-btn-link">
                Admin Login
              </Link>
              <Link to="/signup" className="signup-btn-link">
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
