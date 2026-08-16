import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BioAssigContext } from "../../context/BioAssigContext";
import { AdminContext } from "../../context/AdminContext";
import UpdateBioAssig from "./UpdateBioAssig";
import "./featchadminBioAssig.css";

const FARM_TYPE_CONFIG = {
  dairy: { label: "🐄 Dairy Farm", class: "dairy" },
  poultry: { label: "🐔 Poultry Farm", class: "poultry" },
  pig: { label: "🐖 Pig Farm", class: "pig" },
  goat: { label: "🐐 Goat Farm", class: "goat" },
  sheep: { label: "🐑 Sheep Farm", class: "sheep" },
};

const FeatchadminBioAssig = () => {
  const { assignments, getAssignmentOfAdmin, deleteAssignment } =
    useContext(BioAssigContext);
  const { adminDetail } = useContext(AdminContext);

  const [loading, setLoading] = useState(true);
  const [selectedAssessmentForEdit, setSelectedAssessmentForEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFarmType, setFilterFarmType] = useState("all");
  const [expandedCardId, setExpandedCardId] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      if (getAssignmentOfAdmin) {
        await getAssignmentOfAdmin();
      }
    } catch (err) {
      console.error("Error loading admin biosecurity assessments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Do you really want to delete this biosecurity assessment record?"
    );
    if (!confirmed) return;

    try {
      const success = await deleteAssignment(id);
      if (success) {
        setStatusMsg({
          text: "Biosecurity assessment was deleted successfully.",
          type: "success",
        });
        setTimeout(() => setStatusMsg({ text: "", type: "" }), 4000);
      } else {
        setStatusMsg({
          text: "Failed to delete assessment.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({
        text: "Error occurred while deleting assessment.",
        type: "error",
      });
    }
  };

  const handleOpenEdit = (item) => {
    setSelectedAssessmentForEdit(item);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setSelectedAssessmentForEdit(null);
    setShowEditModal(false);
  };

  const handleAssessmentUpdated = () => {
    setStatusMsg({
      text: "Biosecurity assessment updated successfully!",
      type: "success",
    });
    setTimeout(() => setStatusMsg({ text: "", type: "" }), 4000);
    loadData();
  };

  const toggleExpandCard = (id) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
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

  const filteredAssessments = (assignments || []).filter((item) => {
    const matchesFarm =
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
      (item._id && item._id.toLowerCase().includes(term)) ||
      farmTypeStr.includes(term) ||
      officerName.includes(term) ||
      district.includes(term) ||
      hasMatchingQuestion;

    return matchesFarm && matchesSearch;
  });

  const totalQuestionsConfigured = (assignments || []).reduce(
    (acc, curr) => acc + (curr.question_answer?.length || 0),
    0
  );

  return (
    <div className="fetch-bio-page">
      <div className="fetch-bio-container">
        {/* Header */}
        <div className="bio-page-header">
          <div className="header-text">
            <h1 className="bio-main-title">
              <span>🛡️</span> Biosecurity Assignments
            </h1>
            <p className="bio-subtitle">
              Manage on-farm inspection checklists and pre-set verified benchmark answers by farm type
            </p>
          </div>

          <Link to="/createbioassig" className="btn-create-new-bio">
            <span className="plus-symbol">＋</span> New Assignment
          </Link>
        </div>

        {/* Status Toast */}
        {statusMsg.text && (
          <div className={`bio-toast-banner ${statusMsg.type}`}>
            {statusMsg.type === "success" ? "✅" : "⚠️"} {statusMsg.text}
          </div>
        )}

        {/* Quick Metric Bar */}
        <div className="bio-metrics-bar">
          <div className="metric-chip total">
            <span className="metric-val">{(assignments || []).length}</span>
            <span className="metric-lbl">Total Assignments</span>
          </div>
          <div className="metric-chip q-stat">
            <span className="metric-val">{totalQuestionsConfigured}</span>
            <span className="metric-lbl">Total Questions</span>
          </div>
          <div className="metric-chip admin-stat">
            <span className="metric-val">{adminDetail?.name || "Admin"}</span>
            <span className="metric-lbl">Active Officer</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bio-toolbar">
          <div className="bio-search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search assignment by farm type, question text, officer, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bio-search-input"
            />
            {searchTerm && (
              <button className="btn-clear-search" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>

          <div className="bio-farm-filter">
            <label className="farm-filter-lbl">Farm Type:</label>
            <select
              value={filterFarmType}
              onChange={(e) => setFilterFarmType(e.target.value)}
              className="bio-farm-select"
            >
              <option value="all">All Farm Types ({(assignments || []).length})</option>
              <option value="dairy">🐄 Dairy</option>
              <option value="poultry">🐔 Poultry</option>
              <option value="pig">🐖 Pig</option>
              <option value="goat">🐐 Goat</option>
              <option value="sheep">🐑 Sheep</option>
            </select>
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="bio-loading-card">
            <div className="bio-spinner"></div>
            <p>Loading biosecurity assignments...</p>
          </div>
        ) : filteredAssessments.length === 0 ? (
          <div className="bio-empty-card">
            <div className="empty-icon-box">📭</div>
            <h3>No Biosecurity Assignments Found</h3>
            <p>
              {searchTerm || filterFarmType !== "all"
                ? "No assignments match the selected search or farm type filter."
                : "You have not created any biosecurity assignments yet."}
            </p>
            <Link to="/createbioassig" className="btn-create-first-bio">
              🛡️ Create Your First Assignment
            </Link>
          </div>
        ) : (
          <div className="bio-cards-grid">
            {filteredAssessments.map((assessment) => {
              const qaList = assessment.question_answer || [];
              const totalCount = qaList.length;
              const isExpanded = expandedCardId === assessment._id;
              const adminName =
                assessment.adminid?.name || adminDetail?.name || "Admin";
              const adminDistrict =
                assessment.adminid?.district || adminDetail?.district || "";
              const fConfig = FARM_TYPE_CONFIG[assessment.farmType?.toLowerCase()] || {
                label: `🐾 ${assessment.farmType || "Livestock"}`,
                class: "default",
              };

              return (
                <div key={assessment._id} className="bio-assessment-card">
                  {/* Top Row */}
                  <div className="card-top-row">
                    <div className="assessment-id-badge">
                      <span className="shield-mini">🛡️</span>
                      <span className="id-txt">{assessment._id.slice(-6).toUpperCase()}</span>
                    </div>

                    <div className="card-top-badges">
                      <span className={`card-farm-badge ${fConfig.class}`}>
                        {fConfig.label}
                      </span>
                      <span className="card-q-badge">
                        📋 {totalCount} Qs
                      </span>
                    </div>
                  </div>

                  {/* Admin & Time Meta Section */}
                  <div className="card-meta-info-section">
                    <div className="meta-info-row">
                      <span className="meta-icon">👤</span>
                      <div className="meta-content">
                        <span className="meta-title">Auditing Officer:</span>
                        <span className="meta-highlight">
                          {adminName} {adminDistrict ? `(${adminDistrict})` : ""}
                        </span>
                      </div>
                    </div>

                    <div className="meta-info-row">
                      <span className="meta-icon">🕒</span>
                      <div className="meta-content">
                        <span className="meta-title">Timestamp:</span>
                        <span className="meta-time-text">
                          {formatDate(assessment.createdAt || assessment.date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Questions Preview / Accordion Toggle */}
                  <div className="questions-accordion">
                    <button
                      type="button"
                      className="btn-accordion-toggle"
                      onClick={() => toggleExpandCard(assessment._id)}
                    >
                      <span>{isExpanded ? "Hide Checklist ▲" : `View Questions & Answers (${totalCount} items) ▼`}</span>
                    </button>

                    {isExpanded && (
                      <div className="accordion-checklist-body">
                        {qaList.map((qa, qIdx) => (
                          <div
                            key={qIdx}
                            className={`checklist-item ${qa.answer ? "pass" : "fail"}`}
                          >
                            <span className="item-icon">{qa.answer ? "✓" : "✕"}</span>
                            <span className="item-text">{qa.question}</span>
                            <span className={`item-ans-pill ${qa.answer ? "ans-yes" : "ans-no"}`}>
                              {qa.answer ? "✓ Correct: Yes" : "✕ Correct: No"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="bio-card-actions">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(assessment)}
                      className="btn-bio-card-update"
                    >
                      ✏️ Update
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(assessment._id)}
                      className="btn-bio-card-delete"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Update Modal */}
        {showEditModal && selectedAssessmentForEdit && (
          <UpdateBioAssig
            show={showEditModal}
            assessmentToEdit={selectedAssessmentForEdit}
            onClose={handleCloseEdit}
            onAssessmentUpdated={handleAssessmentUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default FeatchadminBioAssig;
