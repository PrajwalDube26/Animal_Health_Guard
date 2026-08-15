import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertContext } from "../../context/AlertContext";
import { AdminContext } from "../../context/AdminContext";
import UpdateAlert from "./UpdateAlert";
import "./featchadminAlert.css";

const FeatchadminAlert = () => {
  const { alerts, getAlertByAdminId, deleteAlert } = useContext(AlertContext);
  const { isAdminLoggedIn } = useContext(AdminContext);

  const [loading, setLoading] = useState(true);
  const [selectedAlertForEdit, setSelectedAlertForEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchAlertsData = async () => {
    setLoading(true);
    try {
      if (getAlertByAdminId) {
        await getAlertByAdminId();
      }
    } catch (err) {
      console.error("Error fetching admin alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsData();
  }, []);

  const handleDelete = async (alertId, alertTitle) => {
    // Show confirmation alert as requested
    const isConfirmed = window.confirm(
      `Do you really want to delete this alert: "${alertTitle || alertId}"?`
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const success = await deleteAlert(alertId);
      if (success) {
        setStatusMessage({
          text: `Alert "${alertTitle || alertId}" has been deleted successfully.`,
          type: "success",
        });
        setTimeout(() => setStatusMessage({ text: "", type: "" }), 4000);
      } else {
        setStatusMessage({
          text: "Failed to delete alert. Please try again.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        text: "Error occurred while deleting alert.",
        type: "error",
      });
    }
  };

  const handleOpenEdit = (alertItem) => {
    setSelectedAlertForEdit(alertItem);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setSelectedAlertForEdit(null);
    setShowEditModal(false);
  };

  const handleAlertUpdated = (updatedAlert) => {
    setStatusMessage({
      text: `Alert "${updatedAlert.title}" was updated successfully!`,
      type: "success",
    });
    setTimeout(() => setStatusMessage({ text: "", type: "" }), 4000);
    fetchAlertsData();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredAlerts = (alerts || []).filter((item) => {
    const matchesSeverity =
      filterSeverity === "all" || item.severity === filterSeverity;
    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.district && item.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.farmType && item.farmType.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.location && item.location.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="fetch-alerts-page">
      <div className="fetch-alerts-container">
        {/* Top Header */}
        <div className="alerts-page-header">
          <div className="header-text-block">
            <h1 className="alerts-main-title">
              <span className="title-emoji">📢</span> Emergency Health Alerts
            </h1>
            <p className="alerts-subtitle">
              Manage, monitor, update, and broadcast real-time animal health alerts across Maharashtra
            </p>
          </div>
          <Link to="/createalert" className="btn-create-new-alert">
            <span className="plus-icon">＋</span> Create New Alert
          </Link>
        </div>

        {/* Status Toast / Alert Banner */}
        {statusMessage.text && (
          <div className={`status-toast-banner ${statusMessage.type}`}>
            {statusMessage.type === "success" ? "✅" : "⚠️"} {statusMessage.text}
          </div>
        )}

        {/* Filter & Stats Toolbar */}
        <div className="alerts-toolbar">
          <div className="search-box-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by title, district, farm type, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-group">
            <label className="filter-label">Filter Severity:</label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Severities ({(alerts || []).length})</option>
              <option value="high">
                🔴 High Risk ({(alerts || []).filter((a) => a.severity === "high").length})
              </option>
              <option value="medium">
                🟡 Medium Risk ({(alerts || []).filter((a) => a.severity === "medium").length})
              </option>
              <option value="low">
                🟢 Low / Advisory ({(alerts || []).filter((a) => a.severity === "low").length})
              </option>
            </select>
          </div>
        </div>

        {/* Alerts Grid / Content */}
        {loading ? (
          <div className="loading-state-card">
            <div className="spinner"></div>
            <p>Loading alerts from database...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="empty-alerts-card">
            <div className="empty-icon">📭</div>
            <h3>No Alerts Found</h3>
            <p>
              {searchTerm || filterSeverity !== "all"
                ? "No alerts match the selected search/filter criteria."
                : "You haven't broadcasted any alerts yet."}
            </p>
            <Link to="/createalert" className="btn-create-first-alert">
              🚨 Broadcast Your First Alert
            </Link>
          </div>
        ) : (
          <div className="alerts-grid">
            {filteredAlerts.map((alertItem) => (
              <div
                key={alertItem._id}
                className={`alert-card severity-border-${alertItem.severity || "low"}`}
              >
                {/* Card Top */}
                <div className="alert-card-top">
                  <div className="badge-row">
                    <span
                      className={`severity-badge badge-${alertItem.severity || "low"}`}
                    >
                      <span className="dot-indicator"></span>
                      {alertItem.severity ? alertItem.severity.toUpperCase() : "LOW"} SEVERITY
                    </span>
                    <span className="farm-type-badge">
                      🐾 {alertItem.farmType ? alertItem.farmType.toUpperCase() : "GENERAL"}
                    </span>
                  </div>

                  <span className="alert-date">
                    🕒 {formatDate(alertItem.createdAt || alertItem.updatedAt)}
                  </span>
                </div>

                {/* Card Title & Content */}
                <h3 className="alert-card-title">{alertItem.title}</h3>

                <div className="alert-location-tag">
                  📍 <strong>{alertItem.district || "Maharashtra"}</strong>
                  {alertItem.location && ` • ${alertItem.location}`}
                </div>

                <p className="alert-card-message">{alertItem.message}</p>

                {/* Card Actions */}
                <div className="alert-card-actions">
                  <button
                    onClick={() => handleOpenEdit(alertItem)}
                    className="btn-card-action btn-update"
                    title="Update alert details"
                  >
                    ✏️ Update
                  </button>
                  <button
                    onClick={() => handleDelete(alertItem._id, alertItem.title)}
                    className="btn-card-action btn-delete"
                    title="Delete this alert"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Update Alert Modal Popup */}
        {showEditModal && selectedAlertForEdit && (
          <UpdateAlert
            show={showEditModal}
            alertToEdit={selectedAlertForEdit}
            onClose={handleCloseEdit}
            onAlertUpdated={handleAlertUpdated}
          />
        )}
      </div>
    </div>
  );
};

export { FeatchadminAlert, FeatchadminAlert as FetchAdminAlert };
export default FeatchadminAlert;
