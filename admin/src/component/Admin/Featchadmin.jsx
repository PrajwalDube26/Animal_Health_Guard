import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import "./featchadmin.css";

const Featchadmin = () => {
  const { getAdmin, adminDetail, adminLogout } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (getAdmin) {
      getAdmin();
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const formatDate = (date) => {
    if (!date) return "Not Available";
    return new Date(date).toLocaleDateString();
  };

  const handleLogout = async () => {
    const success = await adminLogout();
    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-card">
        {/* Header / Avatar */}
        <div className="admin-profile-header">
          <div className="admin-profile-avatar">
            {getInitials(adminDetail?.name)}
          </div>
          <h2 className="admin-profile-name">
            {adminDetail?.name || "Admin Officer"}
          </h2>
          <p className="admin-profile-role">
            Authority / District Officer
          </p>
        </div>

        {/* Details */}
        <div className="admin-profile-details">
          <div className="detail-item">
            <span className="detail-label">Email</span>
            <span className="detail-value">
              {adminDetail?.email || "Not Available"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Phone</span>
            <span className="detail-value">
              {adminDetail?.phone || "Not Available"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">District</span>
            <span className="detail-value">
              {adminDetail?.district || "Not Available"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Location / HQ</span>
            <span className="detail-value">
              {adminDetail?.location || "Not Available"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Admin ID</span>
            <span className="detail-value">
              {adminDetail?._id || "Not Available"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Session</span>
            <span className="detail-value">
              <button
                onClick={handleLogout}
                className="action-btn secondary"
                style={{ padding: "0.35rem 0.8rem", fontSize: "0.85rem" }}
              >
                Logout
              </button>
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="admin-profile-actions">
          <Link to="/updateadmin" className="action-btn primary">
            ✏ Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Featchadmin;
