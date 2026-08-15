import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertContext } from "../../context/AlertContext";
import { UserAlertContext } from "../../context/UserAlertContext";
import CreateUserAlert from "../UserAlert/CreateUserAlert";
import "./ShowAllAlert.css";

const DISTRICTS = [
  "All", "Ahilyanagar", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", "Chandrapur",
  "Chhatrapati Sambhajinagar", "Dharashiv", "Dhule", "Gadchiroli", "Gondia",
  "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City",
  "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Palghar",
  "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
  "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
];

const FARM_TYPES = ["all", "dairy", "poultry", "goat", "sheep", "pig"];

const ShowAllAlert = () => {
  const { getAllAlerts, alerts } = useContext(AlertContext);
  const { getUserAlertByUserId, isAlertRead } = useContext(UserAlertContext);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterFarmType, setFilterFarmType] = useState("all");
  const [filterDistrict, setFilterDistrict] = useState("All");
  const [readFilter, setReadFilter] = useState("all"); // 'all', 'unread', 'read'
  const [selectedAlertForView, setSelectedAlertForView] = useState(null);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      if (getAllAlerts) {
        await getAllAlerts();
      }
      if (getUserAlertByUserId) {
        await getUserAlertByUserId();
      }
    } catch (err) {
      console.error("Error loading alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

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

  const getSeverityLabel = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "HIGH RISK OUTBREAK";
      case "medium":
        return "MODERATE RISK";
      case "low":
        return "GENERAL ADVISORY";
      default:
        return "ALERT";
    }
  };

  const getFarmEmoji = (type) => {
    switch (type?.toLowerCase()) {
      case "dairy":
        return "🐄";
      case "poultry":
        return "🐔";
      case "goat":
        return "🐐";
      case "sheep":
        return "🐑";
      case "pig":
        return "🐖";
      default:
        return "🐾";
    }
  };

  const filteredAlerts = (alerts || []).filter((item) => {
    const matchesSeverity =
      filterSeverity === "all" || item.severity?.toLowerCase() === filterSeverity;
    const matchesFarmType =
      filterFarmType === "all" || item.farmType?.toLowerCase() === filterFarmType;
    const matchesDistrict =
      filterDistrict === "All" || item.district === filterDistrict;

    const isRead = isAlertRead(item._id);
    const matchesReadStatus =
      readFilter === "all" ||
      (readFilter === "read" && isRead) ||
      (readFilter === "unread" && !isRead);

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.message && item.message.toLowerCase().includes(term)) ||
      (item.district && item.district.toLowerCase().includes(term)) ||
      (item.location && item.location.toLowerCase().includes(term)) ||
      (item.farmType && item.farmType.toLowerCase().includes(term));

    return matchesSeverity && matchesFarmType && matchesDistrict && matchesReadStatus && matchesSearch;
  });

  const highRiskCount = (alerts || []).filter((a) => a.severity?.toLowerCase() === "high").length;
  const mediumRiskCount = (alerts || []).filter((a) => a.severity?.toLowerCase() === "medium").length;
  const lowRiskCount = (alerts || []).filter((a) => a.severity?.toLowerCase() === "low").length;
  const readCount = (alerts || []).filter((a) => isAlertRead(a._id)).length;

  return (
    <div className="alerts-page-wrapper">
      <div className="alerts-page-container">
        {/* Page Header */}
        <div className="alerts-hero-header">
          <div className="header-top-line">
            <div className="header-badge">🚨 Real-time Veterinary Surveillance</div>
            <Link to="/useralert" className="btn-my-read-alerts">
              📌 Acknowledged ({readCount})
            </Link>
          </div>

          <h1 className="alerts-hero-title">
            <span className="hero-emoji">📢</span> Emergency Animal Health Alerts
          </h1>
          <p className="alerts-hero-subtitle">
            Stay informed with verified animal disease outbreak alerts, preventive advisories, and biosecurity guidelines across Maharashtra districts.
          </p>

          {/* Quick Stats Strip */}
          <div className="alerts-stats-strip">
            <div
              className={`stat-pill total ${readFilter === "all" ? "active" : ""}`}
              onClick={() => setReadFilter("all")}
              title="View all alerts"
            >
              <span className="stat-num">{(alerts || []).length}</span>
              <span className="stat-lbl">Active Alerts</span>
            </div>
            <div className="stat-pill high">
              <span className="stat-num">{highRiskCount}</span>
              <span className="stat-lbl">High Outbreaks</span>
            </div>
            <div className="stat-pill medium">
              <span className="stat-num">{mediumRiskCount}</span>
              <span className="stat-lbl">Moderate Risks</span>
            </div>
            <div className="stat-pill low">
              <span className="stat-num">{lowRiskCount}</span>
              <span className="stat-lbl">General Advisories</span>
            </div>
            <div
              className={`stat-pill read-pill ${readFilter === "read" ? "active" : ""}`}
              onClick={() => setReadFilter(readFilter === "read" ? "all" : "read")}
              title="Click to toggle read alerts"
            >
              <span className="stat-num">✓ {readCount}</span>
              <span className="stat-lbl">Marked Read</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="alerts-filter-toolbar">
          <div className="search-bar-block">
            <span className="search-icon-symbol">🔍</span>
            <input
              type="text"
              placeholder="Search alerts by title, symptoms, district, village, or animal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="toolbar-search-input"
            />
            {searchTerm && (
              <button
                className="btn-clear-search"
                onClick={() => setSearchTerm("")}
                title="Clear Search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filters-row">
            {/* Read/Unread Filter */}
            <div className="filter-item">
              <label className="filter-tag-label">Status:</label>
              <select
                value={readFilter}
                onChange={(e) => setReadFilter(e.target.value)}
                className="toolbar-select"
              >
                <option value="all">All Status ({(alerts || []).length})</option>
                <option value="unread">📌 Unread ({ (alerts || []).length - readCount })</option>
                <option value="read">✓ Read ({readCount})</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="filter-item">
              <label className="filter-tag-label">Severity:</label>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="toolbar-select"
              >
                <option value="all">All Severities</option>
                <option value="high">🔴 High Risk ({highRiskCount})</option>
                <option value="medium">🟡 Medium Risk ({mediumRiskCount})</option>
                <option value="low">🟢 Low / Advisory ({lowRiskCount})</option>
              </select>
            </div>

            {/* Farm Type Filter */}
            <div className="filter-item">
              <label className="filter-tag-label">Animal / Farm:</label>
              <select
                value={filterFarmType}
                onChange={(e) => setFilterFarmType(e.target.value)}
                className="toolbar-select"
              >
                <option value="all">All Animals</option>
                {FARM_TYPES.filter((t) => t !== "all").map((type) => (
                  <option key={type} value={type}>
                    {getFarmEmoji(type)} {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div className="filter-item">
              <label className="filter-tag-label">District:</label>
              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="toolbar-select"
              >
                {DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist === "All" ? "All Districts" : `📍 ${dist}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadAlerts}
              className="btn-refresh-alerts"
              title="Refresh alerts data"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="alerts-loading-card">
            <div className="loading-spinner"></div>
            <p className="loading-text">Fetching latest veterinary health advisories...</p>
          </div>
        ) : filteredAlerts.length === 0 ? (
          <div className="alerts-empty-card">
            <div className="empty-icon-graphic">📭</div>
            <h3 className="empty-title">No Alerts Found</h3>
            <p className="empty-desc">
              {searchTerm || filterSeverity !== "all" || filterFarmType !== "all" || filterDistrict !== "All" || readFilter !== "all"
                ? "No disease alerts match the selected search or filter criteria. Try adjusting your filters."
                : "There are currently no active disease alerts broadcasted."}
            </p>
            {(searchTerm || filterSeverity !== "all" || filterFarmType !== "all" || filterDistrict !== "All" || readFilter !== "all") && (
              <button
                className="btn-reset-filters"
                onClick={() => {
                  setSearchTerm("");
                  setFilterSeverity("all");
                  setFilterFarmType("all");
                  setFilterDistrict("All");
                  setReadFilter("all");
                }}
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="alerts-cards-grid">
            {filteredAlerts.map((alert) => {
              const alertIsRead = isAlertRead(alert._id);

              return (
                <div
                  key={alert._id}
                  className={`alert-item-card severity-${alert.severity?.toLowerCase() || "low"} ${alertIsRead ? "is-read-card" : ""}`}
                >
                  {/* Card Top / Badges */}
                  <div className="alert-item-top">
                    <div className="badges-group">
                      <span className={`badge-severity badge-sev-${alert.severity?.toLowerCase() || "low"}`}>
                        <span className="pulse-dot"></span>
                        {getSeverityLabel(alert.severity)}
                      </span>
                      <span className="badge-farm-category">
                        {getFarmEmoji(alert.farmType)} {alert.farmType ? alert.farmType.toUpperCase() : "GENERAL"}
                      </span>
                    </div>

                    <span className="alert-timestamp">
                      🕒 {formatDate(alert.createdAt || alert.updatedAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="alert-item-title">{alert.title}</h3>

                  {/* Location */}
                  <div className="alert-item-location">
                    <span className="location-pin">📍</span>
                    <strong>{alert.district || "Maharashtra"}</strong>
                    {alert.location && <span className="location-detail">• {alert.location}</span>}
                  </div>

                  {/* Advisory Message */}
                  <p className="alert-item-message">{alert.message}</p>

                  {/* Card Footer Actions */}
                  <div className="alert-item-footer">
                    <button
                      onClick={() => setSelectedAlertForView(alert)}
                      className="btn-view-advisory"
                    >
                      📖 Read Full Advisory
                    </button>

                    {/* Mark as Read button */}
                    <CreateUserAlert
                      alertId={alert._id}
                      alertTitle={alert.title}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Advisory Modal Popup */}
        {selectedAlertForView && (
          <div
            className="alert-detail-backdrop"
            onClick={() => setSelectedAlertForView(null)}
          >
            <div
              className="alert-detail-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="alert-detail-content">
                {/* Modal Header */}
                <div className="alert-detail-header">
                  <div className="modal-header-text">
                    <span className={`modal-sev-pill sev-${selectedAlertForView.severity?.toLowerCase()}`}>
                      <span className="pulse-dot"></span>
                      {getSeverityLabel(selectedAlertForView.severity)}
                    </span>
                    <h2 className="modal-alert-title">{selectedAlertForView.title}</h2>
                  </div>
                  <button
                    className="btn-close-modal"
                    onClick={() => setSelectedAlertForView(null)}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                </div>

                {/* Modal Body */}
                <div className="alert-detail-body">
                  <div className="detail-meta-grid">
                    <div className="meta-box">
                      <span className="meta-label">Animal Category</span>
                      <span className="meta-value">
                        {getFarmEmoji(selectedAlertForView.farmType)} {selectedAlertForView.farmType?.toUpperCase() || "GENERAL"}
                      </span>
                    </div>

                    <div className="meta-box">
                      <span className="meta-label">District</span>
                      <span className="meta-value">📍 {selectedAlertForView.district || "Not Specified"}</span>
                    </div>

                    <div className="meta-box">
                      <span className="meta-label">Location / Village</span>
                      <span className="meta-value">{selectedAlertForView.location || "District-wide"}</span>
                    </div>

                    <div className="meta-box">
                      <span className="meta-label">Broadcast Date</span>
                      <span className="meta-value">🕒 {formatDate(selectedAlertForView.createdAt)}</span>
                    </div>
                  </div>

                  <div className="advisory-text-wrapper">
                    <h4 className="advisory-heading">📋 Advisory & Emergency Instructions</h4>
                    <div className="advisory-full-message">
                      {selectedAlertForView.message}
                    </div>
                  </div>

                  <div className="biosecurity-reminder-box">
                    <span className="reminder-icon">🛡️</span>
                    <div className="reminder-text">
                      <strong>Biosecurity Recommendation:</strong> Isolate affected animals immediately, disinfect shelter areas, and contact your local government veterinary officer for vaccination and testing protocols.
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="alert-detail-footer">
                  <CreateUserAlert
                    alertId={selectedAlertForView._id}
                    alertTitle={selectedAlertForView.title}
                  />
                  <button
                    className="btn-modal-done"
                    onClick={() => setSelectedAlertForView(null)}
                  >
                    Close Advisory
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowAllAlert;