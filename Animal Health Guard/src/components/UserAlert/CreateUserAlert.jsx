import React, { useContext, useState } from "react";
import { UserAlertContext } from "../../context/UserAlertContext";
import "./CreateUserAlert.css";

const CreateUserAlert = ({ alertId, alertTitle, isRead: propIsRead, onStatusChange }) => {
  const { createUserAlert, unmarkAlertAsRead, isAlertRead } = useContext(UserAlertContext);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const isRead = propIsRead !== undefined ? propIsRead : isAlertRead(alertId);

  const handleMarkAsRead = async (e) => {
    e.stopPropagation();
    if (!alertId) return;

    setLoading(true);
    setFeedback("");

    try {
      const result = await createUserAlert(alertId);
      if (result.success || result.status === 409) {
        setFeedback("Marked as read");
        if (onStatusChange) onStatusChange(alertId, true);
        setTimeout(() => setFeedback(""), 3000);
      } else {
        setFeedback(result.message || "Failed to mark as read");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch (err) {
      console.error("Error marking alert as read:", err);
      setFeedback("Error occurred");
      setTimeout(() => setFeedback(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleUnmarkAsRead = async (e) => {
    e.stopPropagation();
    if (!alertId) return;

    setLoading(true);
    setFeedback("");

    try {
      const success = await unmarkAlertAsRead(alertId);
      if (success) {
        setFeedback("Marked as unread");
        if (onStatusChange) onStatusChange(alertId, false);
        setTimeout(() => setFeedback(""), 3000);
      } else {
        setFeedback("Failed to unmark");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch (err) {
      console.error("Error unmarking alert:", err);
      setFeedback("Error occurred");
      setTimeout(() => setFeedback(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-alert-action-container">
      {isRead ? (
        <div className="read-status-wrapper">
          <span className="badge-read-confirmed">
            <span className="check-icon">✓</span> Read & Acknowledged
          </span>
          <button
            type="button"
            className="btn-unmark-read"
            onClick={handleUnmarkAsRead}
            disabled={loading}
            title="Mark this alert as unread"
          >
            {loading ? "..." : "Unmark"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn-mark-as-read"
          onClick={handleMarkAsRead}
          disabled={loading}
          title="Mark this advisory as read and acknowledged"
        >
          {loading ? (
            <span className="mini-spinner"></span>
          ) : (
            <>
              <span className="mark-icon">👁️</span> Mark as Read
            </>
          )}
        </button>
      )}

      {feedback && (
        <span className="user-alert-feedback-toast">
          {feedback}
        </span>
      )}
    </div>
  );
};

export default CreateUserAlert;
