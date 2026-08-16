import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BioAssigContext } from "../../context/BioAssigContext";
import { FarmContext } from "../../context/FarmContext";
import "./ShowAllBioAssig.css";

const FARM_TYPE_CONFIG = {
  dairy: { label: "🐄 Dairy Farm", class: "dairy" },
  poultry: { label: "🐔 Poultry Farm", class: "poultry" },
  pig: { label: "🐖 Pig Farm", class: "pig" },
  goat: { label: "🐐 Goat Farm", class: "goat" },
  sheep: { label: "🐑 Sheep Farm", class: "sheep" },
};

const ShowAllBioAssig = () => {
  const navigate = useNavigate();
  const { assignments, getAllAssessments } = useContext(BioAssigContext);
  const { farms, getUserFarms } = useContext(FarmContext);

  const [loading, setLoading] = useState(true);
  const [filterFarmType, setFilterFarmType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAuditForModal, setSelectedAuditForModal] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      await getUserFarms();
      if (getAllAssessments) {
        await getAllAssessments();
      }
    } catch (err) {
      console.error("Error loading biosecurity audits:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const filteredAudits = (assignments || []).filter((item) => {
    const matchesFarmType =
      filterFarmType === "all" ||
      (item.farmType && item.farmType.toLowerCase() === filterFarmType.toLowerCase());

    const term = searchTerm.toLowerCase();
    const hasMatchingQuestion = (item.question_answer || []).some((qa) =>
      qa.question.toLowerCase().includes(term)
    );
    const officerName = item.adminid?.name?.toLowerCase() || "";
    const district = item.adminid?.district?.toLowerCase() || "";
    const farmTypeStr = item.farmType?.toLowerCase() || "";

    const matchesSearch =
      !term ||
      farmTypeStr.includes(term) ||
      (item._id && item._id.toLowerCase().includes(term)) ||
      officerName.includes(term) ||
      district.includes(term) ||
      hasMatchingQuestion;

    return matchesFarmType && matchesSearch;
  });

  const handleTakeAuditClick = (item) => {
    const itemType = (item.farmType || "").toLowerCase();
    const matchingFarm = (farms || []).find(
      (f) => f.farmType && f.farmType.toLowerCase() === itemType
    );

    if (matchingFarm) {
      navigate(`/takefarmassignment/${matchingFarm._id}/${item._id}`);
    } else {
      navigate(`/takefarmassignment`);
    }
  };

  return (
    <div className="user-bio-page">
      <div className="user-bio-container">
        {/* Hero */}
        <div className="user-bio-hero">
          <div className="bio-hero-tag">🛡️ Veterinary Biosecurity & Containment Standards</div>
          <h1 className="user-bio-title">
            <span>🛡️</span> Biosecurity Assessment Standards
          </h1>
          <p className="user-bio-subtitle">
            Review certified biosecurity inspection checklists published by veterinary authorities for each livestock farm category
          </p>

          {/* Quick Metrics */}
          <div className="user-bio-metrics">
            <div
              className={`bio-metric-pill total ${filterFarmType === "all" ? "active" : ""}`}
              onClick={() => setFilterFarmType("all")}
            >
              <span className="pill-num">{(assignments || []).length}</span>
              <span className="pill-txt">Total Checklists</span>
            </div>
            <div
              className={`bio-metric-pill low ${filterFarmType === "dairy" ? "active" : ""}`}
              onClick={() => setFilterFarmType(filterFarmType === "dairy" ? "all" : "dairy")}
            >
              <span className="pill-num">
                {(assignments || []).filter((a) => a.farmType?.toLowerCase() === "dairy").length}
              </span>
              <span className="pill-txt">🐄 Dairy Audits</span>
            </div>
            <div
              className={`bio-metric-pill med ${filterFarmType === "poultry" ? "active" : ""}`}
              onClick={() => setFilterFarmType(filterFarmType === "poultry" ? "all" : "poultry")}
            >
              <span className="pill-num">
                {(assignments || []).filter((a) => a.farmType?.toLowerCase() === "poultry").length}
              </span>
              <span className="pill-txt">🐔 Poultry Audits</span>
            </div>
            <div
              className={`bio-metric-pill high ${filterFarmType === "goat" || filterFarmType === "sheep" ? "active" : ""}`}
              onClick={() => setFilterFarmType(filterFarmType === "goat" ? "all" : "goat")}
            >
              <span className="pill-num">
                {(assignments || []).filter((a) => ["goat", "sheep", "pig"].includes(a.farmType?.toLowerCase())).length}
              </span>
              <span className="pill-txt">🐐 Small Stock & Pigs</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="user-bio-toolbar">
          <div className="bio-search-wrapper">
            <span className="search-ico">🔍</span>
            <input
              type="text"
              placeholder="Search by farm type, officer name, district, measure..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="user-bio-search-input"
            />
            {searchTerm && (
              <button
                className="btn-clear-search"
                onClick={() => setSearchTerm("")}
              >
                ✕
              </button>
            )}
          </div>

          <div className="bio-filter-wrapper">
            <label className="filter-title">Farm Category:</label>
            <select
              value={filterFarmType}
              onChange={(e) => setFilterFarmType(e.target.value)}
              className="user-bio-select"
            >
              <option value="all">All Farm Types ({(assignments || []).length})</option>
              <option value="dairy">🐄 Dairy Farm</option>
              <option value="poultry">🐔 Poultry Farm</option>
              <option value="pig">🐖 Pig Farm</option>
              <option value="goat">🐐 Goat Farm</option>
              <option value="sheep">🐑 Sheep Farm</option>
            </select>
          </div>
        </div>

        {/* Content List */}
        {loading ? (
          <div className="user-bio-loading">
            <div className="bio-spinner"></div>
            <p>Loading biosecurity assessment checklists...</p>
          </div>
        ) : filteredAudits.length === 0 ? (
          <div className="user-bio-empty">
            <div className="empty-ico">📭</div>
            <h3>No Biosecurity Assessments Found</h3>
            <p>
              No biosecurity checklists match your selected filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterFarmType("all");
                setSearchTerm("");
              }}
              className="btn-reset-filters"
            >
              🔄 Reset Filters
            </button>
          </div>
        ) : (
          <div className="user-bio-grid">
            {filteredAudits.map((item) => {
              const qaList = item.question_answer || [];
              const total = qaList.length;
              const fConfig = FARM_TYPE_CONFIG[item.farmType?.toLowerCase()] || {
                label: `🐾 ${item.farmType || "Livestock"} Farm`,
                class: "default",
              };

              return (
                <div key={item._id} className="user-bio-card level-low">
                  {/* Top */}
                  <div className="user-bio-card-top">
                    <div className="audit-id-badge">
                      <span>🛡️</span> ID: {item._id.slice(-6).toUpperCase()}
                    </div>

                    <span className={`risk-badge-pill low`}>
                      {fConfig.label}
                    </span>
                  </div>

                  {/* Summary Box */}
                  <div className="user-bio-score-box">
                    <div className="score-meter">
                      <span className="meter-val" style={{ color: "#38bdf8" }}>{total}</span>
                      <span className="meter-lbl">Measures</span>
                    </div>

                    <div className="score-details">
                      <span className="stat-passed">
                        📋 {total} Certified Checklist Items
                      </span>
                      <span className="stat-date">
                        🕒 Published: {formatDate(item.createdAt || item.date)}
                      </span>
                    </div>
                  </div>

                  {/* Authority Info */}
                  <div className="authority-info-strip">
                    <span className="authority-label">Auditing Authority:</span>
                    <span className="authority-val">
                      {item.adminid?.name ? `Officer ${item.adminid.name}` : "Veterinary Inspectorate"}
                      {item.adminid?.district && ` (${item.adminid.district})`}
                    </span>
                  </div>

                  {/* Card Footer */}
                  <div className="user-bio-card-footer">
                    <button
                      type="button"
                      onClick={() => setSelectedAuditForModal(item)}
                      className="btn-view-audit-report"
                    >
                      📋 Full Checklist
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTakeAuditClick(item)}
                      className="btn-take-audit-direct"
                    >
                      🚀 Take Audit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Modal */}
        {selectedAuditForModal && (
          <div
            className="user-bio-modal-backdrop"
            onClick={() => setSelectedAuditForModal(null)}
          >
            <div
              className="user-bio-modal-dialog"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="user-bio-modal-content">
                <div className="modal-header">
                  <div className="modal-header-text">
                    <span className="modal-icon">🛡️</span>
                    <div>
                      <h3>{(selectedAuditForModal.farmType || "Biosecurity").toUpperCase()} Inspection Checklist</h3>
                      <span className="modal-sub">
                        Record ID: <span className="mono">{selectedAuditForModal._id}</span>
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-modal-close"
                    onClick={() => setSelectedAuditForModal(null)}
                  >
                    &times;
                  </button>
                </div>

                <div className="modal-body">
                  {/* Checklist */}
                  <div className="modal-checklist-section">
                    <h4>Standard Inspection Checklist ({(selectedAuditForModal.question_answer || []).length} items)</h4>
                    <div className="modal-checklist-list">
                      {(selectedAuditForModal.question_answer || []).map((qa, idx) => (
                        <div
                          key={idx}
                          className={`modal-checklist-item ${qa.answer ? "compliant" : "hazard"}`}
                        >
                          <span className="q-marker">#{idx + 1}</span>
                          <span className="q-desc">{qa.question}</span>
                          <span className={`q-status-badge ${qa.answer ? "pass" : "fail"}`}>
                            {qa.answer ? "✓ Pass" : "✕ Gap"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => {
                      const item = selectedAuditForModal;
                      setSelectedAuditForModal(null);
                      handleTakeAuditClick(item);
                    }}
                    className="btn-modal-primary"
                  >
                    🚀 Conduct Audit For My Farm
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedAuditForModal(null)}
                    className="btn-modal-secondary"
                  >
                    Close
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

export default ShowAllBioAssig;
