import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FarmAssignmentContext } from "../../context/FarmAssignmentContext";
import { FarmContext } from "../../context/FarmContext";
import { BioAssigContext } from "../../context/BioAssigContext";
import "./GetFarmAssignment.css";

const FARM_TYPE_CONFIG = {
  dairy: { label: "🐄 Dairy Farm", class: "dairy" },
  poultry: { label: "🐔 Poultry Farm", class: "poultry" },
  pig: { label: "🐖 Pig Farm", class: "pig" },
  goat: { label: "🐐 Goat Farm", class: "goat" },
  sheep: { label: "🐑 Sheep Farm", class: "sheep" },
};

const GetFarmAssignment = () => {
  const { farmId: routeFarmId } = useParams();
  const navigate = useNavigate();

  const {
    farmAssignments,
    getAllFarmAssignments,
    getFarmAssignmentByFarmId,
    deleteFarmAssignment,
  } = useContext(FarmAssignmentContext);

  const { farms, getUserFarms } = useContext(FarmContext);
  const { assignments, getAllAssessments } = useContext(BioAssigContext);

  const [loading, setLoading] = useState(true);
  const [filterFarmId, setFilterFarmId] = useState(routeFarmId || "all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  const loadData = async () => {
    setLoading(true);
    try {
      await getUserFarms();
      await getAllAssessments();
      if (routeFarmId) {
        await getFarmAssignmentByFarmId(routeFarmId);
      } else {
        await getAllFarmAssignments();
      }
    } catch (err) {
      console.error("Error loading farm assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [routeFarmId]);

  useEffect(() => {
    if (routeFarmId) {
      setFilterFarmId(routeFarmId);
    }
  }, [routeFarmId]);

  const activeFarm = (farms || []).find((f) => f._id === filterFarmId);

  const handleDelete = async (farmId, assignmentId) => {
    const confirmed = window.confirm("Are you sure you want to delete this farm audit response?");
    if (!confirmed) return;

    try {
      const success = await deleteFarmAssignment(farmId, assignmentId);
      if (success) {
        setStatusMsg({ text: "Farm audit record deleted successfully.", type: "success" });
        setTimeout(() => setStatusMsg({ text: "", type: "" }), 3500);
      } else {
        setStatusMsg({ text: "Failed to delete record.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ text: "Error deleting audit record.", type: "error" });
    }
  };

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
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

  // Filter completed assignments strictly matching farm and matching farmType
  const filteredList = (farmAssignments || []).filter((item) => {
    const currentFarmId = item.farmId?._id || item.farmId || "";
    const matchesFarm = filterFarmId === "all" || currentFarmId === filterFarmId;

    // Enforce that farm type of farm matches assignment farm type
    const itemFarmType = (item.farmId?.farmType || "").toLowerCase();
    const itemAssigType = (item.assignment_id?.farmType || "").toLowerCase();

    // If both farm and assignment have farmType, ensure they are equal
    const typesMatch =
      !itemFarmType || !itemAssigType || itemFarmType === itemAssigType;

    // If active farm is chosen, ensure assignment matches active farm's farmType
    const matchesActiveFarmType =
      !activeFarm ||
      !activeFarm.farmType ||
      itemAssigType === activeFarm.farmType.toLowerCase();

    const term = searchTerm.toLowerCase();
    const farmName = item.farmId?.farmName?.toLowerCase() || "";
    const location = item.farmId?.location?.toLowerCase() || "";
    const officer = item.assignment_id?.adminid?.name?.toLowerCase() || "";
    const matchesSearch =
      !term ||
      farmName.includes(term) ||
      location.includes(term) ||
      officer.includes(term) ||
      (item._id && item._id.toLowerCase().includes(term));

    return matchesFarm && typesMatch && matchesActiveFarmType && matchesSearch;
  });

  // Check available biosecurity assignments created by admins that match active farm's farmType
  const matchingChecklists = (assignments || []).filter((a) => {
    if (!activeFarm || !activeFarm.farmType) return true;
    return a.farmType && a.farmType.toLowerCase() === activeFarm.farmType.toLowerCase();
  });

  // Calculate metrics
  const totalAudits = filteredList.length;
  const avgScore =
    totalAudits > 0
      ? Math.round(
        filteredList.reduce((acc, curr) => acc + (curr.farmer_score_percentage || 0), 0) /
        totalAudits
      )
      : 0;
  const highCompliance = filteredList.filter((item) => (item.farmer_score_percentage || 0) >= 80).length;

  return (
    <div className="farm-assig-page">
      <div className="farm-assig-container">
        {/* Navigation Breadcrumb */}
        <div className="farm-nav-breadcrumb" style={{ textAlign: "left", marginBottom: "1rem" }}>
          <Link
            to={filterFarmId !== "all" ? `/getsinglefarm/${filterFarmId}` : "/getfarm"}
            style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}
          >
            ← Back to {activeFarm ? activeFarm.farmName : "My Farms"}
          </Link>
        </div>

        {/* Header */}
        <div className="farm-assig-header">
          <div className="header-info">
            <div className="header-badge">
              🛡️ {activeFarm ? `${activeFarm.farmType?.toUpperCase()} Farm Audits` : "Farm Biosecurity Assessments"}
            </div>
            <h1 className="header-title">
              {activeFarm ? `${activeFarm.farmName} - Biosecurity Audits` : "Farm Biosecurity Assessments"}
            </h1>
            <p className="header-subtitle">
              {activeFarm
                ? `Showing only certified ${activeFarm.farmType?.toUpperCase()} biosecurity assessments for ${activeFarm.farmName}`
                : "View and conduct on-farm biosecurity compliance audits tailored to each livestock farm type"}
            </p>
          </div>

          <Link
            to={filterFarmId !== "all" ? `/takefarmassignment/${filterFarmId}` : "/takefarmassignment"}
            className="btn-take-new-audit"
          >
            <span className="plus-symbol">＋</span> Conduct New Audit
          </Link>
        </div>

        {/* Status Toast */}
        {statusMsg.text && (
          <div className={`farm-toast-banner ${statusMsg.type}`}>
            {statusMsg.type === "success" ? "✅" : "⚠️"} {statusMsg.text}
          </div>
        )}

        {/* Metrics Overview Bar */}
        <div className="farm-metrics-bar">
          <div className="metric-card total">
            <span className="metric-value">{totalAudits}</span>
            <span className="metric-title">Audits Completed</span>
          </div>

          <div className="metric-card avg">
            <span className="metric-value">{avgScore}%</span>
            <span className="metric-title">Average Compliance</span>
          </div>

          <div className="metric-card high">
            <span className="metric-value">{highCompliance}</span>
            <span className="metric-title">🟢 High Compliance (≥80%)</span>
          </div>

          <div className="metric-card farms-covered">
            <span className="metric-value">
              {activeFarm ? (activeFarm.farmType?.toUpperCase() || "FARM") : (farms || []).length}
            </span>
            <span className="metric-title">{activeFarm ? "Livestock Category" : "Farms Registered"}</span>
          </div>
        </div>

        {/* Toolbar Filter */}
        <div className="farm-toolbar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search audit records by officer, location, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button className="btn-clear-txt" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>

          <div className="filter-wrapper">
            <label className="filter-label">Selected Farm:</label>
            <select
              value={filterFarmId}
              onChange={(e) => {
                setFilterFarmId(e.target.value);
                if (e.target.value !== "all") {
                  navigate(`/farmassignments/${e.target.value}`);
                } else {
                  navigate(`/farmassignment`);
                }
              }}
              className="toolbar-select"
            >
              <option value="all">All My Farms</option>
              {(farms || []).map((f) => (
                <option key={f._id} value={f._id}>
                  {f.farmName} ({f.farmType?.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Available Questionnaires matching this farm */}
        {activeFarm && matchingChecklists.length > 0 && (
          <div className="available-checklists-card" style={{
            background: "rgba(30, 27, 75, 0.6)",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            borderRadius: "18px",
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            textAlign: "left"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.85rem", flexWrap: "wrap", gap: "0.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", margin: "0 0 0.2rem 0", color: "#ffffff" }}>
                  📋 Available {activeFarm.farmType?.toUpperCase()} Biosecurity Checklists ({matchingChecklists.length})
                </h3>
                <span style={{ fontSize: "0.8rem", color: "rgba(255, 255, 255, 0.6)" }}>
                  Certified biosecurity checklists published by veterinary authorities for {activeFarm.farmType} farms
                </span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap" }}>
              {matchingChecklists.map((chk) => (
                <div key={chk._id} style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "12px",
                  padding: "0.75rem 1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  flex: "1",
                  minWidth: "260px"
                }}>
                  <div>
                    <strong style={{ fontSize: "0.88rem", color: "#38bdf8", display: "block" }}>
                      🛡️ Audit #{chk._id.slice(-6).toUpperCase()} ({(chk.question_answer || []).length} Measures)
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>
                      Officer: {chk.adminid?.name || "Veterinary Authority"}
                    </span>
                  </div>

                  <Link
                    to={`/takefarmassignment/${activeFarm._id}/${chk._id}`}
                    style={{
                      padding: "0.45rem 0.9rem",
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      color: "#ffffff",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      whiteSpace: "nowrap"
                    }}
                  >
                    🚀 Take Audit
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* List Content */}
        {loading ? (
          <div className="farm-loading-card">
            <div className="farm-spinner"></div>
            <p>Loading your farm biosecurity assessments...</p>
          </div>
        ) : filteredList.length === 0 ? (
          <div className="farm-empty-card">
            <div className="empty-ico">📭</div>
            <h3>No Completed Audits Found</h3>
            <p>
              {activeFarm
                ? `You have not completed any ${activeFarm.farmType?.toUpperCase()} biosecurity assessments for ${activeFarm.farmName} yet.`
                : "No completed biosecurity assessments found matching your filter."}
            </p>
            <Link
              to={activeFarm ? `/takefarmassignment/${activeFarm._id}` : "/takefarmassignment"}
              className="btn-start-first-audit"
            >
              🛡️ Conduct Biosecurity Audit
            </Link>
          </div>
        ) : (
          <div className="audit-cards-grid">
            {filteredList.map((item) => {
              const farm = item.farmId || {};
              const assessment = item.assignment_id || {};
              const fType = (farm.farmType || assessment.farmType || "").toLowerCase();
              const fConfig = FARM_TYPE_CONFIG[fType] || {
                label: `🐾 ${fType || "Livestock"}`,
                class: "default",
              };

              const score = item.farmer_score_percentage !== undefined ? item.farmer_score_percentage : 0;
              const isExpanded = expandedId === item._id;

              const qaList = assessment.question_answer || [];
              const farmerAnswers = item.farmer_answer || [];

              return (
                <div key={item._id} className="farm-audit-card">
                  {/* Top Bar */}
                  <div className="card-top-header">
                    <div className="farm-identity">
                      <span className="farm-icon">🚜</span>
                      <div>
                        <h3 className="card-farm-name">{farm.farmName || "Registered Farm"}</h3>
                        <span className="card-farm-location">📍 {farm.location || "Farm Site"}</span>
                      </div>
                    </div>

                    <span className={`farm-type-badge ${fConfig.class}`}>
                      {fConfig.label}
                    </span>
                  </div>

                  {/* Score & Compliance Section */}
                  <div className="card-score-box">
                    <div className="score-badge-circle">
                      <span className="score-num">{score}%</span>
                      <span className="score-lbl">Compliance</span>
                    </div>

                    <div className="score-details-col">
                      <span className={`compliance-tag ${score >= 80 ? "green" : score >= 50 ? "yellow" : "red"}`}>
                        {score >= 80 ? "✓ HIGH COMPLIANCE" : score >= 50 ? "⚡ MODERATE RISK" : "⚠️ CRITICAL GAPS"}
                      </span>
                      <span className="audit-timestamp">
                        🕒 {formatDate(item.createdAt || item.date)}
                      </span>
                    </div>
                  </div>

                  {/* Authority Info */}
                  <div className="card-officer-strip">
                    <span className="officer-label">Auditing Authority:</span>
                    <span className="officer-name">
                      {assessment.adminid?.name ? `Officer ${assessment.adminid.name}` : "Veterinary Inspector"}
                      {assessment.adminid?.district ? ` (${assessment.adminid.district})` : ""}
                    </span>
                  </div>

                  {/* Accordion: Question-by-Question Breakdown */}
                  <div className="card-accordion-section">
                    <button
                      type="button"
                      className="btn-toggle-breakdown"
                      onClick={() => toggleExpand(item._id)}
                    >
                      <span>
                        {isExpanded ? "Hide Breakdown ▲" : `View Answers Breakdown (${qaList.length} items) ▼`}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="breakdown-body">
                        {qaList.map((qObj, qIdx) => {
                          const fAns = farmerAnswers[qIdx]?.answer;
                          const standardAns = (item.admin_answer && item.admin_answer[qIdx] !== undefined)
                            ? item.admin_answer[qIdx]?.answer
                            : qObj.answer;
                          const isMatch = fAns === standardAns;

                          return (
                            <div
                              key={qIdx}
                              className={`breakdown-item ${isMatch ? "pass" : "fail"}`}
                            >
                              <div className="breakdown-q-row">
                                <span className="q-index">#{qIdx + 1}</span>
                                <span className="q-statement">{qObj.question}</span>
                              </div>

                              <div className="breakdown-answers-row">
                                <span className="farmer-ans-tag">
                                  Your Answer: <strong className={fAns ? "ans-yes-txt" : "ans-no-txt"}>{fAns ? "Yes" : "No"}</strong>
                                </span>
                                <span className="standard-ans-tag">
                                  Standard Answer: <strong className={standardAns ? "ans-yes-txt" : "ans-no-txt"}>{standardAns ? "Yes" : "No"}</strong>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="card-footer-actions">
                    <Link
                      to={`/takefarmassignment/${farm._id || farm}/${assessment._id || assessment}`}
                      className="btn-retake-audit"
                    >
                      🔄 Retake / Update
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDelete(farm._id || farm, assessment._id || assessment)}
                      className="btn-delete-record"
                    >
                      🗑️
                    </button>
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

export default GetFarmAssignment;
