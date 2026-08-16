import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FarmAssignmentContext } from "../../context/FarmAssignmentContext";
import { FarmContext } from "../../context/FarmContext";
import { BioAssigContext } from "../../context/BioAssigContext";
import "./TakeFarmAssignment.css";

const FARM_TYPE_CONFIG = {
  dairy: { label: "🐄 Dairy Farm", class: "dairy" },
  poultry: { label: "🐔 Poultry Farm", class: "poultry" },
  pig: { label: "🐖 Pig Farm", class: "pig" },
  goat: { label: "🐐 Goat Farm", class: "goat" },
  sheep: { label: "🐑 Sheep Farm", class: "sheep" },
};

const TakeFarmAssignment = () => {
  const { farmId: paramFarmId, assignmentId: paramAssignmentId } = useParams();
  const navigate = useNavigate();

  const { createFarmAssignment } = useContext(FarmAssignmentContext);
  const { farms, getUserFarms, getFarmById } = useContext(FarmContext);
  const { assignments, getAllAssessments, getAssignmentById } = useContext(BioAssigContext);

  const [selectedFarmId, setSelectedFarmId] = useState(paramFarmId || "");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(paramAssignmentId || "");
  const [currentAssignment, setCurrentAssignment] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });
  const [submissionResult, setSubmissionResult] = useState(null);

  // Load farms and assignments on mount
  useEffect(() => {
    getUserFarms();
    getAllAssessments();
    if (paramFarmId && getFarmById) {
      getFarmById(paramFarmId);
    }
  }, [paramFarmId]);

  // Update selected IDs if URL params change
  useEffect(() => {
    if (paramFarmId) setSelectedFarmId(paramFarmId);
    if (paramAssignmentId) setSelectedAssignmentId(paramAssignmentId);
  }, [paramFarmId, paramAssignmentId]);

  const selectedFarm = (farms || []).find((f) => f._id === selectedFarmId);

  // Filter assignments strictly matching selected farm's farmType
  const availableAssignments = (assignments || []).filter((a) => {
    if (!selectedFarm || !selectedFarm.farmType) return false;
    return (
      a.farmType &&
      a.farmType.toLowerCase() === selectedFarm.farmType.toLowerCase()
    );
  });

  // Auto-select or validate assignment when farm changes
  useEffect(() => {
    if (selectedFarm && availableAssignments.length > 0) {
      const isCurrentValid = availableAssignments.some((a) => a._id === selectedAssignmentId);
      if (!isCurrentValid) {
        setSelectedAssignmentId(availableAssignments[0]._id);
      }
    } else if (selectedFarm && availableAssignments.length === 0) {
      setSelectedAssignmentId("");
      setCurrentAssignment(null);
    }
  }, [selectedFarmId, assignments]);

  // Load selected assignment details & initialize answers
  useEffect(() => {
    const fetchAssignmentDetails = async () => {
      if (!selectedAssignmentId) {
        setCurrentAssignment(null);
        setAnswers([]);
        return;
      }

      setLoading(true);
      try {
        let found = (assignments || []).find((a) => a._id === selectedAssignmentId);
        if (!found && getAssignmentById) {
          found = await getAssignmentById(selectedAssignmentId);
        }

        if (found) {
          // Double check farmType match if farm is selected
          if (
            selectedFarm &&
            found.farmType &&
            selectedFarm.farmType &&
            found.farmType.toLowerCase() !== selectedFarm.farmType.toLowerCase()
          ) {
            setCurrentAssignment(null);
            setAnswers([]);
            setStatusMsg({
              text: `This biosecurity audit is for ${found.farmType.toUpperCase()} farms, but your farm is ${selectedFarm.farmType.toUpperCase()}.`,
              type: "error",
            });
            return;
          }

          setCurrentAssignment(found);
          const qa = found.question_answer || [];
          setAnswers(qa.map(() => true)); // default to true
        }
      } catch (err) {
        console.error("Error loading assignment details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentDetails();
  }, [selectedAssignmentId, assignments, selectedFarmId]);

  const handleToggleAnswer = (index, val) => {
    setAnswers((prev) =>
      prev.map((item, idx) => (idx === index ? val : item))
    );
  };

  // Calculate live score comparison with benchmark
  const calculateLiveScore = () => {
    if (!currentAssignment || !currentAssignment.question_answer) return 0;
    const qa = currentAssignment.question_answer;
    if (qa.length === 0) return 100;

    let matches = 0;
    qa.forEach((q, idx) => {
      if (answers[idx] === q.answer) {
        matches++;
      }
    });

    return Math.round((matches / qa.length) * 100);
  };

  const liveScore = calculateLiveScore();

  const getScoreBadge = (score) => {
    if (score >= 80) return { label: "EXCELLENT", color: "#10b981", class: "excellent" };
    if (score >= 50) return { label: "MODERATE", color: "#f59e0b", class: "moderate" };
    return { label: "NEEDS ATTENTION", color: "#ef4444", class: "critical" };
  };

  const scoreBadge = getScoreBadge(liveScore);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: "", type: "" });

    if (!selectedFarmId || !selectedFarm) {
      setStatusMsg({ text: "Please select a farm for this audit.", type: "error" });
      return;
    }

    if (!selectedAssignmentId || !currentAssignment) {
      setStatusMsg({ text: "Please select a matching biosecurity audit questionnaire.", type: "error" });
      return;
    }

    // Verify farmType consistency
    if (
      currentAssignment.farmType &&
      selectedFarm.farmType &&
      currentAssignment.farmType.toLowerCase() !== selectedFarm.farmType.toLowerCase()
    ) {
      setStatusMsg({
        text: `Cannot submit: Audit farm type (${currentAssignment.farmType}) must match your farm (${selectedFarm.farmType}).`,
        type: "error",
      });
      return;
    }

    if (answers.length === 0) {
      setStatusMsg({ text: "The selected checklist has no questions to answer.", type: "error" });
      return;
    }

    setSubmitting(true);

    try {
      const formattedAnswers = answers.map((val) => ({ answer: Boolean(val) }));
      const result = await createFarmAssignment(
        selectedFarmId,
        selectedAssignmentId,
        formattedAnswers,
        liveScore
      );

      if (result) {
        setSubmissionResult({
          score: liveScore,
          farmName: selectedFarm?.farmName || "Your Farm",
          farmId: selectedFarm?._id,
          total: answers.length,
          compliantCount: answers.filter((a) => a === true).length,
        });
      } else {
        setStatusMsg({
          text: "Failed to submit farm audit. Please check your network and try again.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({
        text: "An error occurred while saving the audit response.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="take-audit-page">
      <div className="take-audit-container">
        {/* Navigation Breadcrumb */}
        <div className="audit-nav-breadcrumb" style={{ textAlign: "left", marginBottom: "1rem" }}>
          <Link
            to={selectedFarmId ? `/getsinglefarm/${selectedFarmId}` : "/getfarm"}
            style={{ color: "#38bdf8", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}
          >
            ← Back to Farm
          </Link>
        </div>

        {/* Header */}
        <div className="take-audit-header">
          <div className="header-badge-tag">🛡️ Farm Biosecurity Audit</div>
          <h1 className="take-audit-title">Conduct On-Farm Biosecurity Assessment</h1>
          <p className="take-audit-subtitle">
            Answer the certified biosecurity inspection questions designed specifically for your livestock farm type
          </p>
        </div>

        {/* Selection Bar */}
        <div className="audit-selection-card">
          <div className="selection-col">
            <label className="select-label">🚜 Select Your Farm:</label>
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="audit-select"
            >
              <option value="">-- Choose Farm --</option>
              {(farms || []).map((farm) => (
                <option key={farm._id} value={farm._id}>
                  {farm.farmName} ({(farm.farmType || "Farm").toUpperCase()} - {farm.location})
                </option>
              ))}
            </select>
          </div>

          <div className="selection-col">
            <label className="select-label">
              📋 {selectedFarm ? `${(selectedFarm.farmType || "").toUpperCase()} Audit Questionnaire:` : "Select Questionnaire:"}
            </label>
            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="audit-select"
              disabled={!selectedFarmId || availableAssignments.length === 0}
            >
              {!selectedFarmId ? (
                <option value="">-- Select a Farm First --</option>
              ) : availableAssignments.length === 0 ? (
                <option value="">No {selectedFarm.farmType} Audits Available</option>
              ) : (
                availableAssignments.map((a) => (
                  <option key={a._id} value={a._id}>
                    {(a.farmType || "Livestock").toUpperCase()} Audit #{a._id.slice(-6).toUpperCase()} ({(a.question_answer || []).length} Qs)
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Status Toast */}
        {statusMsg.text && (
          <div className={`audit-toast ${statusMsg.type}`}>
            {statusMsg.type === "success" ? "✅" : "⚠️"} {statusMsg.text}
          </div>
        )}

        {/* Active Farm & Questionnaire Info */}
        {selectedFarm && currentAssignment && (
          <div className="audit-meta-bar">
            <div className="meta-chip">
              <span className="meta-ico">🚜</span>
              <div>
                <span className="chip-lbl">Target Farm</span>
                <span className="chip-val">{selectedFarm.farmName} ({selectedFarm.farmType?.toUpperCase()})</span>
              </div>
            </div>

            <div className="meta-chip">
              <span className="meta-ico">👤</span>
              <div>
                <span className="chip-lbl">Auditing Authority</span>
                <span className="chip-val">
                  {currentAssignment.adminid?.name ? `Officer ${currentAssignment.adminid.name}` : "Veterinary Inspector"}
                </span>
              </div>
            </div>

            <div className="meta-chip score-preview">
              <span className="meta-ico">📊</span>
              <div>
                <span className="chip-lbl">Compliance Score</span>
                <span className={`chip-score ${scoreBadge.class}`}>
                  {liveScore}% ({scoreBadge.label})
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Questionnaire Form */}
        {loading ? (
          <div className="audit-loading-card">
            <div className="audit-spinner"></div>
            <p>Loading inspection checklist questions...</p>
          </div>
        ) : !selectedFarm ? (
          <div className="audit-prompt-card">
            <div className="prompt-icon">🚜</div>
            <h3>Please Select Your Farm</h3>
            <p>Choose a farm above to load biosecurity checklists created specifically for that livestock category.</p>
            {farms.length === 0 && (
              <Link to="/addfarm" className="btn-add-farm-prompt">
                ➕ Add a Farm First
              </Link>
            )}
          </div>
        ) : availableAssignments.length === 0 ? (
          <div className="audit-prompt-card">
            <div className="prompt-icon">📭</div>
            <h3>No Biosecurity Assessments for {selectedFarm.farmType?.toUpperCase()}</h3>
            <p>
              Veterinary officers have not yet published a biosecurity assignment for <strong>{selectedFarm.farmType}</strong> farms.
            </p>
            <Link to={`/getsinglefarm/${selectedFarm._id}`} className="btn-add-farm-prompt">
              ← Return to Farm Details
            </Link>
          </div>
        ) : !currentAssignment ? (
          <div className="audit-prompt-card">
            <div className="prompt-icon">📋</div>
            <h3>Please Select a Biosecurity Checklist</h3>
            <p>Select one of the available {selectedFarm.farmType} checklists above to begin.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="audit-questions-form">
            <div className="questions-card">
              <div className="questions-card-header">
                <h3>Inspection Measures ({(currentAssignment.question_answer || []).length} items) - {selectedFarm.farmType?.toUpperCase()}</h3>
                <span className="helper-text">
                  Mark whether your farm currently implements each biosecurity measure
                </span>
              </div>

              <div className="questions-list">
                {(currentAssignment.question_answer || []).map((item, idx) => (
                  <div
                    key={idx}
                    className={`audit-question-card ${answers[idx] === true ? "ans-yes" : "ans-no"}`}
                  >
                    <div className="q-content-col">
                      <span className="q-number">Measure #{idx + 1}</span>
                      <p className="q-text">{item.question}</p>
                    </div>

                    <div className="q-toggle-controls">
                      <button
                        type="button"
                        className={`btn-toggle-answer yes ${answers[idx] === true ? "active" : ""}`}
                        onClick={() => handleToggleAnswer(idx, true)}
                      >
                        ✓ Yes (Active)
                      </button>
                      <button
                        type="button"
                        className={`btn-toggle-answer no ${answers[idx] === false ? "active" : ""}`}
                        onClick={() => handleToggleAnswer(idx, false)}
                      >
                        ✕ No (Gap)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="audit-form-actions">
              <Link to={`/farmassignments/${selectedFarm._id}`} className="btn-audit-cancel">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="btn-audit-submit"
              >
                {submitting ? "Evaluating & Submitting..." : "🛡️ Submit Farm Biosecurity Audit"}
              </button>
            </div>
          </form>
        )}

        {/* Scorecard Modal on Success */}
        {submissionResult && (
          <div className="scorecard-backdrop">
            <div className="scorecard-dialog">
              <div className="scorecard-content">
                <div className="scorecard-icon">🎉</div>
                <h2 className="scorecard-title">Audit Completed Successfully!</h2>
                <p className="scorecard-farm">
                  Farm: <strong>{submissionResult.farmName}</strong>
                </p>

                <div className="scorecard-meter-box">
                  <span className="scorecard-number">{submissionResult.score}%</span>
                  <span className="scorecard-label">Overall Biosecurity Compliance</span>
                </div>

                <p className="scorecard-feedback">
                  {submissionResult.score >= 80
                    ? "🌟 Excellent biosecurity compliance! Your farm demonstrates robust containment standards."
                    : submissionResult.score >= 50
                      ? "⚡ Moderate compliance level. Several biosecurity gaps require immediate corrective actions."
                      : "⚠️ Critical vulnerabilities detected. Immediate disinfection & perimeter containment recommended."}
                </p>

                <div className="scorecard-actions">
                  <Link
                    to={`/farmassignments/${submissionResult.farmId}`}
                    className="btn-scorecard-view"
                  >
                    📋 View Farm Audits
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSubmissionResult(null)}
                    className="btn-scorecard-close"
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

export default TakeFarmAssignment;
