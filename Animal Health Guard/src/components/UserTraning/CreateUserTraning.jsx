import React, { useContext, useState } from "react";
import { UserTrainingContext } from "../../context/UserTrainingContext";
import "./CreateUserTraning.css";

const CreateUserTraning = ({ traningId, trainingId, moduleTitle, isEnrolled: propIsEnrolled, onStatusChange }) => {
  const targetId = traningId || trainingId;
  const { createUserTraining, unenrollUserTraining, isTrainingEnrolled } = useContext(UserTrainingContext);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const isEnrolled = propIsEnrolled !== undefined ? propIsEnrolled : isTrainingEnrolled(targetId);

  const handleEnroll = async (e) => {
    e.stopPropagation();
    if (!targetId) return;

    setLoading(true);
    setFeedback("");

    try {
      const result = await createUserTraining(targetId);
      if (result.success || result.status === 409) {
        setFeedback("Enrolled & Completed!");
        if (onStatusChange) onStatusChange(targetId, true);
        setTimeout(() => setFeedback(""), 3000);
      } else {
        setFeedback(result.message || "Failed to enroll");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch (err) {
      console.error("Error enrolling in training:", err);
      setFeedback("Error occurred");
      setTimeout(() => setFeedback(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (e) => {
    e.stopPropagation();
    if (!targetId) return;

    setLoading(true);
    setFeedback("");

    try {
      const success = await unenrollUserTraining(targetId);
      if (success) {
        setFeedback("Progress reset");
        if (onStatusChange) onStatusChange(targetId, false);
        setTimeout(() => setFeedback(""), 3000);
      } else {
        setFeedback("Failed to unenroll");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch (err) {
      console.error("Error resetting training progress:", err);
      setFeedback("Error occurred");
      setTimeout(() => setFeedback(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-training-action-container">
      {isEnrolled ? (
        <div className="enrolled-status-wrapper">
          <span className="badge-enrolled-confirmed">
            <span className="check-symbol">✓</span> Completed
          </span>
          <button
            type="button"
            className="btn-unenroll-training"
            onClick={handleUnenroll}
            disabled={loading}
            title="Reset training completion status"
          >
            {loading ? "..." : "Reset"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn-enroll-training"
          onClick={handleEnroll}
          disabled={loading}
          title="Mark this module as completed & add to your curriculum"
        >
          {loading ? (
            <span className="training-mini-spinner"></span>
          ) : (
            <>
              <span className="enroll-icon">🎓</span> Mark Completed
            </>
          )}
        </button>
      )}

      {feedback && (
        <span className="user-training-feedback-toast">
          {feedback}
        </span>
      )}
    </div>
  );
};

export { CreateUserTraning, CreateUserTraning as CreateUserTraining };
export default CreateUserTraning;
