import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./featchuser.css";

const FeatchUser = () => {
  const { getUser, user_detail, Logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (getUser) {
      getUser();
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "Not Available";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleLogout = async () => {
    const success = await Logout();
    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="user-profile-container">
      <div className="user-profile-card">
        {/* Header / Avatar */}
        <div className="user-profile-header">
          <div className="user-profile-avatar">
            {getInitials(user_detail?.name)}
          </div>
          <h2 className="user-profile-name">
            {user_detail?.name || "Farmer User"}
          </h2>
          <p className="user-profile-role">
            🌾 Registered Farmer & Livestock Producer
          </p>
        </div>

        {/* Details List */}
        <div className="user-profile-details">
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">
              {user_detail?.email || "Not Available"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Phone</span>
            <span className="detail-value">
              {user_detail?.phone || "Not Available"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Location / Village</span>
            <span className="detail-value">
              {user_detail?.location || "Not Available"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Member Since</span>
            <span className="detail-value">
              {formatDate(user_detail?.createdAt)}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">User ID</span>
            <span className="detail-value">
              {user_detail?._id ? user_detail._id.slice(-8).toUpperCase() : "Not Available"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Session</span>
            <span className="detail-value">
              <button
                onClick={handleLogout}
                className="user-action-btn logout-pill-btn"
              >
                🚪 Logout
              </button>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="user-profile-actions">
          <Link to="/updateuser" className="user-action-btn primary">
            ✏️ Edit Profile
          </Link>
          <Link to="/getfarm" className="user-action-btn secondary">
            🚜 My Farms
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeatchUser;