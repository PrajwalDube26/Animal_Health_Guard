import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserTrainingContext } from "../../context/UserTrainingContext";
import CreateUserTraning from "./CreateUserTraning";
import "./GetUserTraning.css";

const CATEGORY_ICONS = {
  dairy: "🐄",
  poultry: "🐔",
  goat: "🐐",
  sheep: "🐑",
  pig: "🐖",
  biosecurity: "🛡️",
  general: "🌾",
};

const GetUserTraning = () => {
  const { userTrainings, getUserTrainingByUserId, deleteUserTrainingByUserId } =
    useContext(UserTrainingContext);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      if (getUserTrainingByUserId) {
        await getUserTrainingByUserId();
      }
    } catch (err) {
      console.error("Error loading user training history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleClearAll = async () => {
    const confirmed = window.confirm(
      "Do you really want to clear all your completed training history?"
    );
    if (!confirmed) return;

    try {
      const success = await deleteUserTrainingByUserId();
      if (success) {
        setStatusMsg("Training history cleared successfully.");
        setTimeout(() => setStatusMsg(""), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="user-trainings-page">
      <div className="user-trainings-container">
        {/* Header */}
        <div className="user-trainings-header">
          <div>
            <h1 className="user-trainings-title">
              <span>🎓</span> My Completed Training Modules
            </h1>
            <p className="user-trainings-subtitle">
              Courses, disease prevention guides, and veterinary protocols you have successfully completed
            </p>
          </div>

          <div className="header-actions">
            <Link to="/getalltrainingmodule" className="btn-browse-all-training">
              📚 Browse All Modules
            </Link>
            {userTrainings && userTrainings.length > 0 && (
              <button onClick={handleClearAll} className="btn-clear-training-history">
                🗑️ Clear History
              </button>
            )}
          </div>
        </div>

        {statusMsg && (
          <div className="user-training-status-toast">
            ✅ {statusMsg}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="user-trainings-loading">
            <div className="loading-spinner"></div>
            <p>Loading your training curriculum...</p>
          </div>
        ) : !userTrainings || userTrainings.length === 0 ? (
          <div className="user-trainings-empty">
            <div className="empty-icon">📭</div>
            <h3>No Completed Modules Yet</h3>
            <p>
              Explore our veterinary courses and click "Mark Completed" once you finish studying a guide to track your progress here.
            </p>
            <Link to="/getalltrainingmodule" className="btn-start-exploring">
              🎓 Browse Available Courses
            </Link>
          </div>
        ) : (
          <div className="user-trainings-grid">
            {userTrainings.map((item) => {
              const module = item.traningId || item;
              const moduleId = module._id || item.traningId;
              const catKey = (module.category || "general").toLowerCase();
              const icon = CATEGORY_ICONS[catKey] || "📚";

              return (
                <div key={item._id || moduleId} className="user-training-card">
                  <div className="user-training-top">
                    <span className="badge-cat">
                      {icon} {(module.category || "General").toUpperCase()}
                    </span>
                    <span className="badge-lang">
                      🌐 {module.language || "English"}
                    </span>
                    <span className="training-date">
                      🕒 Completed on {formatDate(item.createdAt || module.createdAt)}
                    </span>
                  </div>

                  <h3 className="user-training-card-title">
                    {module.title || "Veterinary Training Guide"}
                  </h3>

                  <p className="user-training-desc">
                    {module.description || "Course guidelines and technical protocol..."}
                  </p>

                  <div className="user-training-footer">
                    <Link
                      to={`/trainingmodule/${moduleId}`}
                      className="btn-review-module"
                    >
                      📖 Review Content
                    </Link>

                    <CreateUserTraning
                      traningId={moduleId}
                      isEnrolled={true}
                      onStatusChange={loadData}
                    />
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

export { GetUserTraning, GetUserTraning as GetUserTraining };
export default GetUserTraning;
