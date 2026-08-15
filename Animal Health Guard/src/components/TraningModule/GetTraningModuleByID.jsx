import React, { useContext, useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { TrainingModuleContext } from "../../context/TrainingModuleContext";
import { UserTrainingContext } from "../../context/UserTrainingContext";
import CreateUserTraning from "../UserTraning/CreateUserTraning";
import "./GetTraningModuleByID.css";

const CATEGORY_MAP = {
  dairy: { label: "Dairy Farming", icon: "🐄", color: "#38bdf8" },
  poultry: { label: "Poultry Care", icon: "🐔", color: "#f59e0b" },
  goat: { label: "Goat Farming", icon: "🐐", color: "#10b981" },
  sheep: { label: "Sheep Rearing", icon: "🐑", color: "#a855f7" },
  pig: { label: "Piggery Sanitation", icon: "🐖", color: "#ec4899" },
  biosecurity: { label: "Biosecurity & Hygiene", icon: "🛡️", color: "#06b6d4" },
  general: { label: "General Husbandry", icon: "🌾", color: "#84cc16" },
};

const GetTraningModuleByID = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTrainingModuleById } = useContext(TrainingModuleContext);
  const { getUserTrainingByUserId, isTrainingEnrolled } = useContext(UserTrainingContext);

  const [moduleData, setModuleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const loadModuleDetail = async () => {
    if (!id) return;
    setLoading(true);
    setErrorMsg("");

    try {
      if (getTrainingModuleById) {
        const result = await getTrainingModuleById(id);
        if (result) {
          setModuleData(result);
        } else {
          setErrorMsg("Training module not found.");
        }
      }
      if (getUserTrainingByUserId) {
        await getUserTrainingByUserId();
      }
    } catch (err) {
      console.error("Error fetching module by ID:", err);
      setErrorMsg("Failed to load module details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModuleDetail();
  }, [id]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCategoryMeta = (cat) => {
    const key = (cat || "general").toLowerCase();
    return CATEGORY_MAP[key] || { label: cat || "General", icon: "📚", color: "#38bdf8" };
  };

  if (loading) {
    return (
      <div className="module-detail-page">
        <div className="module-detail-container">
          <div className="module-detail-loading">
            <div className="detail-spinner"></div>
            <p>Loading comprehensive training module...</p>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || !moduleData) {
    return (
      <div className="module-detail-page">
        <div className="module-detail-container">
          <div className="module-detail-error">
            <div className="error-emoji">⚠️</div>
            <h2>Training Module Unavailable</h2>
            <p>{errorMsg || "The requested training module could not be found."}</p>
            <Link to="/getalltrainingmodule" className="btn-back-catalog">
              ← Return to All Modules
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const catMeta = getCategoryMeta(moduleData.category);
  const isEnrolled = isTrainingEnrolled(moduleData._id);

  return (
    <div className="module-detail-page">
      <div className="module-detail-container">
        {/* Navigation Bar / Breadcrumb */}
        <div className="module-nav-top">
          <Link to="/getalltrainingmodule" className="btn-nav-back">
            ← Back to All Training Modules
          </Link>

          <Link to="/usertraining" className="btn-my-trainings-nav">
            🎓 My Completed Modules
          </Link>
        </div>

        {/* Module Main Card */}
        <div className="module-detail-card">
          {/* Header Banner */}
          <div className="module-header-banner">
            <div className="module-badge-row">
              <span className="banner-cat-badge">
                {catMeta.icon} {catMeta.label.toUpperCase()}
              </span>
              <span className="banner-lang-badge">
                🌐 {moduleData.language || "English"}
              </span>
              <span className="banner-date-badge">
                🕒 Published on {formatDate(moduleData.createdAt)}
              </span>
            </div>

            <h1 className="module-detail-title">{moduleData.title}</h1>
            <p className="module-detail-desc">{moduleData.description}</p>
          </div>

          {/* Metadata Grid */}
          <div className="module-meta-strip">
            <div className="meta-cell">
              <span className="meta-title">Category</span>
              <span className="meta-val">{catMeta.icon} {catMeta.label}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-title">Instruction Medium</span>
              <span className="meta-val">{moduleData.language || "English"}</span>
            </div>
            <div className="meta-cell">
              <span className="meta-title">Publishing Authority</span>
              <span className="meta-val">
                {moduleData.adminid?.name ? `Officer ${moduleData.adminid.name}` : "Veterinary Directorate"}
                {moduleData.adminid?.district && ` (${moduleData.adminid.district})`}
              </span>
            </div>
            <div className="meta-cell">
              <span className="meta-title">Curriculum Status</span>
              <span className="meta-val verified-tag">
                {isEnrolled ? "✓ Completed by You" : "📖 Available"}
              </span>
            </div>
          </div>

          {/* Structured Body Content */}
          <div className="module-content-wrapper">
            <div className="content-section-header">
              <span className="section-icon">📖</span>
              <h3>Detailed Curriculum & Technical Instructions</h3>
            </div>

            <div className="module-full-text">
              {moduleData.content}
            </div>

            {/* Practical Takeaways & Biosecurity Box */}
            <div className="practical-takeaways-card">
              <div className="takeaway-header">
                <span className="shield-icon">🛡️</span>
                <h4>Veterinary Field Guidelines & Best Practices</h4>
              </div>
              <ul className="takeaways-list">
                <li>Strictly maintain clean drinking water and quarantine new or sick animals.</li>
                <li>Follow the government seasonal vaccination schedule for optimal herd protection.</li>
                <li>Record daily symptoms and report sudden illness spikes to your local veterinary officer.</li>
                <li>Ensure sanitary disposal of livestock waste and sanitize feeding troughs regularly.</li>
              </ul>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="module-detail-footer">
            <Link to="/getalltrainingmodule" className="btn-footer-browse">
              ← Browse More Modules
            </Link>

            <div className="footer-action-buttons">
              <CreateUserTraning
                traningId={moduleData._id}
                moduleTitle={moduleData.title}
                onStatusChange={loadModuleDetail}
              />
              <button
                onClick={() => window.print()}
                className="btn-print-module"
                title="Print module for farm reference"
              >
                🖨️ Print Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { GetTraningModuleByID, GetTraningModuleByID as GetTrainingModuleById };
export default GetTraningModuleByID;
