import React, { useState, useEffect, useContext } from "react";
import { BioAssigContext } from "../../context/BioAssigContext";
import { AdminContext } from "../../context/AdminContext";
import "./UpdateBioAssig.css";

const FARM_TYPE_OPTIONS = [
  { value: "dairy", label: "🐄 Dairy Farm" },
  { value: "poultry", label: "🐔 Poultry Farm" },
  { value: "pig", label: "🐖 Pig Farm" },
  { value: "goat", label: "🐐 Goat Farm" },
  { value: "sheep", label: "🐑 Sheep Farm" },
];

const UpdateBioAssig = ({ show = true, assessmentToEdit, onClose, onAssessmentUpdated }) => {
  const { updateAssignment } = useContext(BioAssigContext);
  const { adminDetail } = useContext(AdminContext);

  const [farmType, setFarmType] = useState("dairy");
  const [questionsList, setQuestionsList] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionAnswer, setNewQuestionAnswer] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (assessmentToEdit) {
      setFarmType(assessmentToEdit.farmType || "dairy");
      const qa = assessmentToEdit.question_answer || [];
      setQuestionsList(qa.map((item) => ({
        question: item.question || "",
        answer: Boolean(item.answer),
        _id: item._id,
      })));
      setErrorMsg("");
      setSuccessMsg("");
      setNewQuestionText("");
      setNewQuestionAnswer(true);
    }
  }, [assessmentToEdit]);

  if (!show || !assessmentToEdit) return null;

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

  // Edit question text
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

  // Add new question
  const handleAddQuestion = (e) => {
    if (e) e.preventDefault();
    const trimmed = newQuestionText.trim();
    if (!trimmed) {
      setErrorMsg("Please enter question text before adding.");
      return;
    }

    setQuestionsList((prev) => [
      ...prev,
      { question: trimmed, answer: newQuestionAnswer },
    ]);
    setNewQuestionText("");
    setNewQuestionAnswer(true);
    setErrorMsg("");
  };

  // Remove question
  const handleRemoveQuestion = (index) => {
    if (questionsList.length <= 1) {
      setErrorMsg("Assignment must have at least one question.");
      return;
    }
    setQuestionsList((prev) => prev.filter((_, idx) => idx !== index));
    setErrorMsg("");
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (questionsList.length === 0) {
      setErrorMsg("Assignment must have at least one question.");
      return;
    }

    // Check for empty question strings
    const hasEmptyQuestion = questionsList.some((q) => !q.question.trim());
    if (hasEmptyQuestion) {
      setErrorMsg("All questions must have valid text. Please fill or remove empty questions.");
      return;
    }

    setLoading(true);

    try {
      const sanitizedQA = questionsList.map((q) => ({
        question: q.question.trim(),
        answer: q.answer,
      }));

      const updated = await updateAssignment(
        assessmentToEdit._id,
        0,
        "low",
        sanitizedQA,
        farmType
      );

      if (updated) {
        setSuccessMsg("Assignment questions, answers & farm type updated successfully!");
        if (onAssessmentUpdated) {
          onAssessmentUpdated(updated);
        }
        setTimeout(() => {
          if (onClose) onClose();
        }, 1000);
      } else {
        setErrorMsg("Failed to update assignment. Check server logs.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error occurred while updating assignment.");
    } finally {
      setLoading(false);
    }
  };

  const adminName =
    assessmentToEdit.adminid?.name || adminDetail?.name || "Admin";
  const adminDistrict =
    assessmentToEdit.adminid?.district || adminDetail?.district || "";

  return (
    <div className="update-bio-modal-backdrop" onClick={onClose}>
      <div
        className="update-bio-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="update-bio-modal-content">
          {/* Header */}
          <div className="update-bio-modal-header">
            <div className="modal-title-group">
              <span className="modal-title-icon">✏️</span>
              <div>
                <h3 className="modal-title">Update Biosecurity Assignment</h3>
                <span className="modal-subtitle">
                  Record ID: <span className="mono-id">{assessmentToEdit._id}</span>
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="update-bio-modal-body">
              {errorMsg && (
                <div className="modal-alert-box alert-error">
                  ⚠️ {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="modal-alert-box alert-success">
                  ✅ {successMsg}
                </div>
              )}

              {/* Admin & Time Meta Summary */}
              <div className="modal-meta-summary">
                <div className="modal-meta-item">
                  <span className="meta-icon">👤</span>
                  <div className="meta-text">
                    <span className="meta-lbl">Auditing Admin</span>
                    <span className="meta-val">
                      {adminName} {adminDistrict ? `(${adminDistrict})` : ""}
                    </span>
                  </div>
                </div>

                <div className="modal-meta-item">
                  <span className="meta-icon">🕒</span>
                  <div className="meta-text">
                    <span className="meta-lbl">Timestamp</span>
                    <span className="meta-val">
                      {formatDate(assessmentToEdit.createdAt || assessmentToEdit.date)}
                    </span>
                  </div>
                </div>

                <div className="modal-meta-item">
                  <span className="meta-icon">📋</span>
                  <div className="meta-text">
                    <span className="meta-lbl">Questions</span>
                    <span className="meta-val">{questionsList.length} Items</span>
                  </div>
                </div>
              </div>

              {/* Farm Type Selector Row */}
              <div className="modal-farmtype-section">
                <label className="modal-label">Livestock Farm Type:</label>
                <div className="modal-farmtype-pills">
                  {FARM_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      className={`modal-farmtype-btn ${farmType === opt.value ? "active" : ""}`}
                      onClick={() => setFarmType(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Questions List */}
              <div className="modal-questions-container">
                <div className="modal-questions-header">
                  <label className="modal-label">Audit Checklist Questions ({questionsList.length})</label>
                  <span className="modal-hint">Edit question text or toggle correct answer</span>
                </div>

                <div className="modal-questions-scroll">
                  {questionsList.map((item, idx) => (
                    <div
                      key={idx}
                      className={`modal-question-item ${item.answer ? "compliant" : "hazard"}`}
                    >
                      <div className="modal-q-top">
                        <span className="q-idx">#{idx + 1}</span>
                        <span className="q-ans-badge">
                          Correct: <strong className={item.answer ? "text-pass" : "text-fail"}>{item.answer ? "Yes" : "No"}</strong>
                        </span>
                      </div>

                      <div className="modal-q-middle">
                        <textarea
                          rows={2}
                          className="modal-q-textarea"
                          value={item.question}
                          onChange={(e) => handleQuestionTextChange(idx, e.target.value)}
                          placeholder={`Question #${idx + 1}...`}
                          required
                        />
                      </div>

                      <div className="modal-q-bottom">
                        <div className="toggle-btn-group mini">
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
                          className="btn-q-remove"
                          onClick={() => handleRemoveQuestion(idx)}
                          title="Remove Question"
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Question Row */}
              <div className="modal-add-q-section">
                <label className="modal-label">Add Question</label>
                <div className="modal-add-q-row">
                  <input
                    type="text"
                    placeholder="Enter new biosecurity question..."
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddQuestion();
                      }
                    }}
                    className="modal-add-input"
                  />

                  <div className="toggle-btn-group mini">
                    <button
                      type="button"
                      className={`toggle-option yes ${newQuestionAnswer === true ? "active" : ""}`}
                      onClick={() => setNewQuestionAnswer(true)}
                    >
                      ✓ Yes
                    </button>
                    <button
                      type="button"
                      className={`toggle-option no ${newQuestionAnswer === false ? "active" : ""}`}
                      onClick={() => setNewQuestionAnswer(false)}
                    >
                      ✕ No
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="btn-modal-add-q"
                  >
                    ＋ Add
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="update-bio-modal-footer">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-modal-submit"
                disabled={loading || questionsList.length === 0}
              >
                {loading ? "Saving Changes..." : "💾 Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateBioAssig;
