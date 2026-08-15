import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserAlertContext } from "../../context/UserAlertContext";
import CreateUserAlert from "./CreateUserAlert";
import "./GetUserAlert.css";

const GetUserAlert = () => {
  const { userAlerts, getUserAlertByUserId, deleteUserAlertByUserId } =
    useContext(UserAlertContext);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      if (getUserAlertByUserId) {
        await getUserAlertByUserId();
      }
    } catch (err) {
      console.error("Error loading user alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearAll = async () => {
    const confirmed = window.confirm(
      "Do you really want to clear your read alerts history?"
    );
    if (!confirmed) return;

    try {
      const success = await deleteUserAlertByUserId();
      if (success) {
        setStatusMsg("Read history cleared successfully.");
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="user-alerts-page">
      <div className="user-alerts-container">
        {/* Header */}
        <div className="user-alerts-header">
          <div>
            <h1 className="user-alerts-title">
              <span>📌</span> My Acknowledged Alerts
            </h1>
            <p className="user-alerts-subtitle">
              History of disease advisories and emergency alerts you have read and acknowledged
            </p>
          </div>

          <div className="header-actions">
            <Link to="/showallalert" className="btn-browse-all">
              📢 View All Alerts
            </Link>
            {userAlerts && userAlerts.length > 0 && (
              <button onClick={handleClearAll} className="btn-clear-history">
                🗑️ Clear History
              </button>
            )}
          </div>
        </div>

        {statusMsg && (
          <div className="user-alerts-status-toast">
            ✅ {statusMsg}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="user-alerts-loading">
            <div className="loading-spinner"></div>
            <p>Loading your acknowledged alerts...</p>
          </div>
        ) : !userAlerts || userAlerts.length === 0 ? (
          <div className="user-alerts-empty">
            <div className="empty-icon">📭</div>
            <h3>No Acknowledged Alerts Yet</h3>
            <p>
              When you read emergency notices on the All Alerts page, click "Mark as Read" to keep track of them here.
            </p>
            <Link to="/showallalert" className="btn-browse-alerts">
              🚨 Browse Active Alerts
            </Link>
          </div>
        ) : (
          <div className="user-alerts-grid">
            {userAlerts.map((item) => {
              const alert = item.alertId || item;
              const alertId = alert._id || item.alertId;

              return (
                <div
                  key={item._id || alertId}
                  className={`user-alert-card severity-${alert.severity?.toLowerCase() || "low"}`}
                >
                  <div className="user-alert-top">
                    <span className={`badge-severity ${alert.severity?.toLowerCase()}`}>
                      {alert.severity?.toUpperCase() || "NOTICE"}
                    </span>
                    <span className="badge-farm">
                      🐾 {alert.farmType?.toUpperCase() || "GENERAL"}
                    </span>
                    <span className="alert-time">
                      🕒 {formatDate(alert.createdAt || item.createdAt)}
                    </span>
                  </div>

                  <h3 className="user-alert-card-title">
                    {alert.title || "Health Alert Notice"}
                  </h3>

                  <div className="user-alert-loc">
                    📍 {alert.district || "Maharashtra"}
                    {alert.location && ` • ${alert.location}`}
                  </div>

                  <p className="user-alert-message">
                    {alert.message || "Detailed advisory advisory instructions..."}
                  </p>

                  <div className="user-alert-footer">
                    <CreateUserAlert
                      alertId={alertId}
                      alertTitle={alert.title}
                      isRead={true}
                      onStatusChange={loadData}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetUserAlert;
