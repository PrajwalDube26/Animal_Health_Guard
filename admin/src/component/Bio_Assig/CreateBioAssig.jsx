import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { BioAssigContext } from "../../context/BioAssigContext";
import { AdminContext } from "../../context/AdminContext";
import "./CreateBioAssig.css";

const STANDARD_BIOSECURITY_QUESTIONS = [
  "Is perimeter fencing secured to prevent wild animal & stray livestock intrusion?",
  "Are vehicle wheel disinfection dips or tire sprayers active at the farm gate?",
  "Are disinfectant footbaths maintained and refreshed daily at each shed entrance?",
  "Is there a dedicated quarantine pen for newly acquired or sick animals?",
  "Is the livestock drinking water source protected from surface runoff contamination?",
  "Are deceased animals disposed of via sanitary burial or incineration immediately?",
  "Is animal feed stored in dry, rodent-proof, and elevated storage bins?",
  "Are visitor logs maintained with mandatory boot covers / sanitized clothing?",
  "Are barn disinfection and manure removal schedules recorded systematically?",
  "Are mandatory vaccinations and deworming protocols up to date for the herd?",
];

const FARM_TYPE_OPTIONS = [
  { value: "dairy", label: "🐄 Dairy Farm" },
  { value: "poultry", label: "🐔 Poultry Farm" },
  { value: "pig", label: "🐖 Pig Farm" },
  { value: "goat", label: "🐐 Goat Farm" },
  { value: "sheep", label: "🐑 Sheep Farm" },
];

const CreateBioAssig = () => {
  const { submitAssessment } = useContext(BioAssigContext);
  const { adminDetail } = useContext(AdminContext);
  const navigate = useNavigate();

  const [farmType, setFarmType] = useState("dairy");
  const [questionsList, setQuestionsList] = useState(
    STANDARD_BIOSECURITY_QUESTIONS.map((q) => ({
      question: q,
      answer: true,
    }))
  );

  const [customQuestionText, setCustomQuestionText] = useState("");
  const [customQuestionAnswer, setCustomQuestionAnswer] = useState(true);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateNow = () => {
      setCurrentTime(
        new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateNow();
    const timer = setInterval(updateNow, 30000);
    return () => clearInterval(timer);
  }, []);

  // Update question text
  const handleQuestionTextChange = (index, newText) => {
    setQuestionsList((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, question: newText } : item))
    );
  };

  // Toggle answer (Yes/No)
  const handleToggleAnswer = (index, val) => {
    setQuestionsList((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, answer: val } : item))
    );
  };

  // Add custom question
  const handleAddCustomQuestion = (e) => {
    if (e) e.preventDefault();
    const trimmed = customQuestionText.trim();
    if (!trimmed) {
      setStatusMsg({
        text: "Please enter question text before adding.",
        type: "error",
      });
      return;
    }

    setQuestionsList((prev) => [
      ...prev,
      { question: trimmed, answer: customQuestionAnswer },
    ]);
    setCustomQuestionText("");
    setCustomQuestionAnswer(true);
    setStatusMsg({ text: "", type: "" });
  };

  // Remove question
  const handleRemoveQuestion = (index) => {
    if (questionsList.length <= 1) {
      setStatusMsg({
        text: "Assignment must have at least one question.",
        type: "error",
      });
      return;
    }
    setQuestionsList((prev) => prev.filter((_, idx) => idx !== index));
    setStatusMsg({ text: "", type: "" });
  };

  // Reset to default template
  const handleResetDefault = () => {
    if (window.confirm("Reset checklist to the standard 10 biosecurity questions?")) {
      setQuestionsList(
        STANDARD_BIOSECURITY_QUESTIONS.map((q) => ({
          question: q,
          answer: true,
        }))
      );
      setStatusMsg({ text: "Checklist reset to standard template.", type: "success" });
      setTimeout(() => setStatusMsg({ text: "", type: "" }), 3000);
    }
  };

  // Mark all answers as Yes
  const handleMarkAllYes = () => {
    setQuestionsList((prev) => prev.map((q) => ({ ...q, answer: true })));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: "", type: "" });

    if (questionsList.length === 0) {
      setStatusMsg({
        text: "Please add at least one biosecurity checklist question.",
        type: "error",
      });
      return;
    }

    // Check for empty question strings
    const hasEmptyQuestion = questionsList.some((q) => !q.question.trim());
    if (hasEmptyQuestion) {
      setStatusMsg({
        text: "All questions must contain valid text. Please fill out or remove empty questions.",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        farmType,
        riskScore: 0,
        riskLevel: "low",
        question_answer: questionsList.map((q) => ({
          question: q.question.trim(),
          answer: q.answer,
        })),
      };

      const result = await submitAssessment(payload);

      if (result) {
        setStatusMsg({
          text: `Biosecurity assignment for ${farmType.toUpperCase()} created with benchmark answers successfully!`,
          type: "success",
        });
        setTimeout(() => {
          navigate("/fetchadminbioassig");
        }, 1200);
      } else {
        setStatusMsg({
          text: "Failed to submit assignment. Please check server logs.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({
        text: "An error occurred while submitting assignment.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-bio-container">
      <div className="create-bio-card">
        {/* Header */}
        <div className="create-bio-header">
          <div className="bio-icon-badge">🛡️</div>
          <div className="header-info">
            <h2 className="create-bio-title">Create Biosecurity Assignment</h2>
            <p className="create-bio-subtitle">
              Define standard farm inspection questions and pre-set verified correct benchmark answers
            </p>
          </div>
        </div>

        {/* Farm Type Selector & Meta Info Widget */}
        <div className="bio-creation-meta-widget">
          <div className="meta-widget-item">
            <span className="meta-widget-icon">👤</span>
            <div className="meta-widget-text">
              <span className="meta-widget-label">Auditing Admin</span>
              <span className="meta-widget-val">
                {adminDetail?.name || "Admin"} {adminDetail?.district ? `(${adminDetail.district})` : ""}
              </span>
            </div>
          </div>

          <div className="meta-widget-item">
            <span className="meta-widget-icon">🕒</span>
            <div className="meta-widget-text">
              <span className="meta-widget-label">Timestamp</span>
              <span className="meta-widget-val">{currentTime}</span>
            </div>
          </div>

          <div className="meta-widget-item">
            <span className="meta-widget-icon">📋</span>
            <div className="meta-widget-text">
              <span className="meta-widget-label">Checklist Items</span>
              <span className="meta-widget-val">{questionsList.length} Questions</span>
            </div>
          </div>
        </div>

        {/* Farm Type Selection Box */}
        <div className="farmtype-select-card">
          <div className="farmtype-header-row">
            <label className="farmtype-label">Select Target Farm Type:</label>
            <span className="farmtype-hint">Choose which livestock category this biosecurity assignment applies to</span>
          </div>

          <div className="farmtype-pills-row">
            {FARM_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`farmtype-pill-btn ${farmType === opt.value ? "active" : ""}`}
                onClick={() => setFarmType(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toast / Status */}
        {statusMsg.text && (
          <div className={`bio-status-banner ${statusMsg.type}`}>
            {statusMsg.type === "success" ? "✅" : "⚠️"} {statusMsg.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bio-checklist-form">
          <div className="checklist-section-header">
            <div className="header-title-box">
              <h3>Biosecurity Questions & Benchmark Answers ({questionsList.length})</h3>
              <span className="checklist-helper">
                Admin sets questions and pre-submits verified correct answers (Yes / No)
              </span>
            </div>

            <div className="checklist-quick-actions">
              <button
                type="button"
                className="btn-quick-action"
                onClick={handleMarkAllYes}
                title="Set all correct answers to Yes"
              >
                ✓ All Yes
              </button>
              <button
                type="button"
                className="btn-quick-action"
                onClick={handleResetDefault}
                title="Restore default 10 biosecurity questions"
              >
                🔄 Standard 10
              </button>
            </div>
          </div>

          {/* Editable Questions Scroll List */}
          <div className="questions-scroll-list">
            {questionsList.map((item, idx) => (
              <div
                key={idx}
                className={`question-item-card ${item.answer ? "compliant" : "hazard"}`}
              >
                <div className="question-header-row">
                  <span className="question-number">Question #{idx + 1}</span>
                  <div className="item-answer-label">
                    Correct Answer: <strong className={item.answer ? "ans-yes" : "ans-no"}>{item.answer ? "YES (Pass)" : "NO (Hazard)"}</strong>
                  </div>
                </div>

                <div className="question-body-row">
                  <div className="question-input-wrapper">
                    <textarea
                      rows={2}
                      className="question-edit-textarea"
                      value={item.question}
                      onChange={(e) => handleQuestionTextChange(idx, e.target.value)}
                      placeholder={`Enter question #${idx + 1}...`}
                      required
                    />
                  </div>

                  <div className="question-action-controls">
                    <div className="toggle-btn-group">
                      <button
                        type="button"
                        className={`toggle-option yes ${item.answer === true ? "active" : ""}`}
                        onClick={() => handleToggleAnswer(idx, true)}
                        title="Mark correct answer as Yes"
                      >
                        ✓ Yes
                      </button>
                      <button
                        type="button"
                        className={`toggle-option no ${item.answer === false ? "active" : ""}`}
                        onClick={() => handleToggleAnswer(idx, false)}
                        title="Mark correct answer as No"
                      >
                        ✕ No
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn-delete-q"
                      onClick={() => handleRemoveQuestion(idx)}
                      title="Remove this question"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Question Row */}
          <div className="add-custom-q-card">
            <h4 className="add-q-title">＋ Add New Inspection Question</h4>
            <div className="add-custom-q-fields">
              <input
                type="text"
                placeholder="Enter custom biosecurity audit question..."
                value={customQuestionText}
                onChange={(e) => setCustomQuestionText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCustomQuestion();
                  }
                }}
                className="custom-q-input"
              />

              <div className="add-q-answer-selector">
                <span className="selector-lbl">Correct Answer:</span>
                <div className="toggle-btn-group mini">
                  <button
                    type="button"
                    className={`toggle-option yes ${customQuestionAnswer === true ? "active" : ""}`}
                    onClick={() => setCustomQuestionAnswer(true)}
                  >
                    ✓ Yes
                  </button>
                  <button
                    type="button"
                    className={`toggle-option no ${customQuestionAnswer === false ? "active" : ""}`}
                    onClick={() => setCustomQuestionAnswer(false)}
                  >
                    ✕ No
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddCustomQuestion}
                className="btn-add-q"
              >
                ＋ Add to Checklist
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="create-bio-actions">
            <Link to="/fetchadminbioassig" className="btn-bio-cancel">
              Cancel & View Assignments
            </Link>
            <button
              type="submit"
              disabled={loading || questionsList.length === 0}
              className="btn-bio-submit"
            >
              {loading ? "Saving Assignment..." : "🛡️ Save Biosecurity Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBioAssig;
