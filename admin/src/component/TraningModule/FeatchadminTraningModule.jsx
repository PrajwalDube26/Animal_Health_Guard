import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrainingModuleContext } from "../../context/TrainingModuleContext";
import { AdminContext } from "../../context/AdminContext";
import UpdateTraningModule from "./UpdateTraningModule";
import "./featchadminTraningModule.css";

const CATEGORY_MAP = {
  dairy: { label: "Dairy", icon: "🐄", color: "#38bdf8" },
  poultry: { label: "Poultry", icon: "🐔", color: "#f59e0b" },
  goat: { label: "Goat", icon: "🐐", color: "#10b981" },
  sheep: { label: "Sheep", icon: "🐑", color: "#a855f7" },
  pig: { label: "Pig", icon: "🐖", color: "#ec4899" },
  biosecurity: { label: "Biosecurity", icon: "🛡️", color: "#06b6d4" },
  general: { label: "General", icon: "🌾", color: "#84cc16" },
};

const FeatchadminTraningModule = () => {
  const { trainingModules, getTrainingModuleByAdminId, deleteTrainingModule } =
    useContext(TrainingModuleContext);
  const { isAdminLoggedIn } = useContext(AdminContext);

  const [loading, setLoading] = useState(true);
  const [selectedModuleForEdit, setSelectedModuleForEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchModules = async () => {
    setLoading(true);
    try {
      if (getTrainingModuleByAdminId) {
        await getTrainingModuleByAdminId();
      }
    } catch (err) {
      console.error("Error fetching admin training modules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const handleDelete = async (moduleId, moduleTitle) => {
    const isConfirmed = window.confirm(
      `Do you really want to delete this training module: "${moduleTitle || moduleId}"?`
    );

    if (!isConfirmed) return;

    try {
      const success = await deleteTrainingModule(moduleId);
      if (success) {
        setStatusMessage({
          text: `Training module "${moduleTitle || moduleId}" was deleted successfully.`,
          type: "success",
        });
        setTimeout(() => setStatusMessage({ text: "", type: "" }), 4000);
      } else {
        setStatusMessage({
          text: "Failed to delete training module. Please try again.",
          type: "error",
        });
      }
    } catch (err) {
      console.error(err);
      setStatusMessage({
        text: "Error occurred while deleting training module.",
        type: "error",
      });
    }
  };

  const handleOpenEdit = (moduleItem) => {
    setSelectedModuleForEdit(moduleItem);
    setShowEditModal(true);
  };

  const handleCloseEdit = () => {
    setSelectedModuleForEdit(null);
    setShowEditModal(false);
  };

  const handleModuleUpdated = (updatedModule) => {
    setStatusMessage({
      text: `Training module "${updatedModule.title}" was updated successfully!`,
      type: "success",
    });
    setTimeout(() => setStatusMessage({ text: "", type: "" }), 4000);
    fetchModules();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryInfo = (cat) => {
    const key = (cat || "general").toLowerCase();
    return CATEGORY_MAP[key] || { label: cat || "General", icon: "📚", color: "#38bdf8" };
  };

  const filteredModules = (trainingModules || []).filter((item) => {
    const matchesCategory =
      filterCategory === "all" ||
      (item.category && item.category.toLowerCase() === filterCategory.toLowerCase());

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.description && item.description.toLowerCase().includes(term)) ||
      (item.content && item.content.toLowerCase().includes(term)) ||
      (item.category && item.category.toLowerCase().includes(term)) ||
      (item.language && item.language.toLowerCase().includes(term));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fetch-training-page">
      <div className="fetch-training-container">
        {/* Top Header */}
        <div className="training-page-header">
          <div className="header-text-block">
            <h1 className="training-main-title">
              <span className="title-emoji">🎓</span> Livestock Training Modules
            </h1>
            <p className="training-subtitle">
              Publish, edit, and manage educational courses, veterinary protocols, and animal husbandry guides
            </p>
          </div>
          <Link to="/createtrainingmodule" className="btn-create-new-training">
            <span className="plus-icon">＋</span> Create Training Module
          </Link>
        </div>

        {/* Status Toast Banner */}
        {statusMessage.text && (
          <div className={`training-toast-banner ${statusMessage.type}`}>
            {statusMessage.type === "success" ? "✅" : "⚠️"} {statusMessage.text}
          </div>
        )}

        {/* Filter & Search Toolbar */}
        <div className="training-toolbar">
          <div className="search-box-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by title, overview, content, or language..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-group">
            <label className="filter-label">Category:</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories ({(trainingModules || []).length})</option>
              {Object.entries(CATEGORY_MAP).map(([key, info]) => (
                <option key={key} value={key}>
                  {info.icon} {info.label} ({(trainingModules || []).filter((m) => m.category?.toLowerCase() === key).length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modules Content */}
        {loading ? (
          <div className="loading-state-card">
            <div className="spinner"></div>
            <p>Loading training modules from database...</p>
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="empty-training-card">
            <div className="empty-icon">📭</div>
            <h3>No Training Modules Found</h3>
            <p>
              {searchTerm || filterCategory !== "all"
                ? "No modules match the selected filter criteria."
                : "You haven't created any training modules yet."}
            </p>
            <Link to="/createtrainingmodule" className="btn-create-first-module">
              🎓 Create Your First Training Module
            </Link>
          </div>
        ) : (
          <div className="training-grid">
            {filteredModules.map((moduleItem) => {
              const catInfo = getCategoryInfo(moduleItem.category);

              return (
                <div key={moduleItem._id} className="training-card">
                  {/* Card Top */}
                  <div className="training-card-top">
                    <div className="badge-row">
                      <span className="category-badge">
                        {catInfo.icon} {catInfo.label.toUpperCase()}
                      </span>
                      <span className="language-badge">
                        🌐 {moduleItem.language || "English"}
                      </span>
                    </div>

                    <span className="module-date">
                      🕒 {formatDate(moduleItem.createdAt || moduleItem.updatedAt)}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="training-card-title">{moduleItem.title}</h3>
                  <p className="training-card-desc">{moduleItem.description}</p>

                  {/* Content Preview */}
                  <div className="training-content-preview">
                    <span className="preview-label">Content Preview:</span>
                    <p className="preview-text">{moduleItem.content}</p>
                  </div>

                  {/* Card Actions */}
                  <div className="training-card-actions">
                    <button
                      onClick={() => handleOpenEdit(moduleItem)}
                      className="btn-card-action btn-update"
                      title="Edit training module"
                    >
                      ✏️ Update
                    </button>
                    <button
                      onClick={() => handleDelete(moduleItem._id, moduleItem.title)}
                      className="btn-card-action btn-delete"
                      title="Delete this module"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Update Training Module Modal Popup */}
        {showEditModal && selectedModuleForEdit && (
          <UpdateTraningModule
            show={showEditModal}
            moduleToEdit={selectedModuleForEdit}
            onClose={handleCloseEdit}
            onModuleUpdated={handleModuleUpdated}
          />
        )}
      </div>
    </div>
  );
};

export { FeatchadminTraningModule, FeatchadminTraningModule as FetchAdminTrainingModule };
export default FeatchadminTraningModule;
