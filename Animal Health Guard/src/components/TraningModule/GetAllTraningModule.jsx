import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TrainingModuleContext } from "../../context/TrainingModuleContext";
import { UserTrainingContext } from "../../context/UserTrainingContext";
import CreateUserTraning from "../UserTraning/CreateUserTraning";
import "./GetAllTraningModule.css";

const CATEGORY_MAP = {
  all: { label: "All Categories", icon: "📚" },
  dairy: { label: "Dairy Farming", icon: "🐄" },
  poultry: { label: "Poultry Care", icon: "🐔" },
  goat: { label: "Goat Farming", icon: "🐐" },
  sheep: { label: "Sheep Rearing", icon: "🐑" },
  pig: { label: "Piggery Sanitation", icon: "🐖" },
  biosecurity: { label: "Biosecurity & Hygiene", icon: "🛡️" },
  general: { label: "General Husbandry", icon: "🌾" },
};

const GetAllTraningModule = () => {
  const { getAllTrainingModules, trainingModules } = useContext(TrainingModuleContext);
  const { getUserTrainingByUserId, isTrainingEnrolled } = useContext(UserTrainingContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLanguage, setFilterLanguage] = useState("all");
  const [enrollFilter, setEnrollFilter] = useState("all"); // 'all', 'enrolled', 'not_enrolled'

  const loadModules = async () => {
    setLoading(true);
    try {
      if (getAllTrainingModules) {
        await getAllTrainingModules();
      }
      if (getUserTrainingByUserId) {
        await getUserTrainingByUserId();
      }
    } catch (err) {
      console.error("Error loading training modules:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getCategoryMeta = (cat) => {
    const key = (cat || "general").toLowerCase();
    return CATEGORY_MAP[key] || { label: cat || "General", icon: "📖" };
  };

  const filteredModules = (trainingModules || []).filter((item) => {
    const matchesCategory =
      filterCategory === "all" ||
      (item.category && item.category.toLowerCase() === filterCategory.toLowerCase());

    const matchesLanguage =
      filterLanguage === "all" ||
      (item.language && item.language.toLowerCase() === filterLanguage.toLowerCase());

    const isEnrolled = isTrainingEnrolled(item._id);
    const matchesEnrollment =
      enrollFilter === "all" ||
      (enrollFilter === "enrolled" && isEnrolled) ||
      (enrollFilter === "not_enrolled" && !isEnrolled);

    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.description && item.description.toLowerCase().includes(term)) ||
      (item.content && item.content.toLowerCase().includes(term)) ||
      (item.category && item.category.toLowerCase().includes(term)) ||
      (item.language && item.language.toLowerCase().includes(term));

    return matchesCategory && matchesLanguage && matchesEnrollment && matchesSearch;
  });

  const enrolledCount = (trainingModules || []).filter((m) => isTrainingEnrolled(m._id)).length;
  const dairyCount = (trainingModules || []).filter((m) => m.category?.toLowerCase() === "dairy").length;
  const poultryCount = (trainingModules || []).filter((m) => m.category?.toLowerCase() === "poultry").length;
  const biosecurityCount = (trainingModules || []).filter((m) => m.category?.toLowerCase() === "biosecurity").length;

  return (
    <div className="user-training-page">
      <div className="user-training-container">
        {/* Hero Header */}
        <div className="user-training-hero">
          <div className="training-header-top">
            <div className="training-hero-badge">🎓 Farmer Capacity Building & Guidance</div>
            <Link to="/usertraining" className="btn-my-trainings-link">
              📌 Completed Modules ({enrolledCount})
            </Link>
          </div>

          <h1 className="user-training-title">
            <span>📚</span> Livestock Veterinary Training Modules
          </h1>
          <p className="user-training-subtitle">
            Enhance your livestock productivity, learn certified disease management, vaccination protocols, and biosecurity best practices.
          </p>

          {/* Quick Statistics Strip */}
          <div className="user-training-stats">
            <div
              className={`training-stat-pill total ${enrollFilter === "all" ? "active" : ""}`}
              onClick={() => setEnrollFilter("all")}
              title="View all courses"
            >
              <span className="stat-num">{(trainingModules || []).length}</span>
              <span className="stat-label">Available Courses</span>
            </div>
            <div className="training-stat-pill dairy">
              <span className="stat-num">{dairyCount}</span>
              <span className="stat-label">Dairy Modules</span>
            </div>
            <div className="training-stat-pill poultry">
              <span className="stat-num">{poultryCount}</span>
              <span className="stat-label">Poultry Modules</span>
            </div>
            <div className="training-stat-pill biosecurity">
              <span className="stat-num">{biosecurityCount}</span>
              <span className="stat-label">Biosecurity Guides</span>
            </div>
            <div
              className={`training-stat-pill completed-pill ${enrollFilter === "enrolled" ? "active" : ""}`}
              onClick={() => setEnrollFilter(enrollFilter === "enrolled" ? "all" : "enrolled")}
              title="Click to toggle completed courses"
            >
              <span className="stat-num">✓ {enrolledCount}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
        </div>

        {/* Toolbar: Search & Filter */}
        <div className="user-training-toolbar">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search training modules by topic, disease, procedure, or animal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input-field"
            />
            {searchTerm && (
              <button
                className="btn-clear-search"
                onClick={() => setSearchTerm("")}
                title="Clear Search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-controls-row">
            {/* Enrollment Status Selector */}
            <div className="control-group">
              <label className="control-label">Status:</label>
              <select
                value={enrollFilter}
                onChange={(e) => setEnrollFilter(e.target.value)}
                className="control-select"
              >
                <option value="all">All Courses ({(trainingModules || []).length})</option>
                <option value="enrolled">✓ Completed ({enrolledCount})</option>
                <option value="not_enrolled">📌 Available ({(trainingModules || []).length - enrolledCount})</option>
              </select>
            </div>

            {/* Category Selector */}
            <div className="control-group">
              <label className="control-label">Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="control-select"
              >
                {Object.entries(CATEGORY_MAP).map(([key, info]) => (
                  <option key={key} value={key}>
                    {info.icon} {info.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Selector */}
            <div className="control-group">
              <label className="control-label">Language:</label>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="control-select"
              >
                <option value="all">All Languages</option>
                <option value="English">English</option>
                <option value="Marathi">Marathi (मराठी)</option>
                <option value="Hindi">Hindi (हिंदी)</option>
              </select>
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadModules}
              className="btn-refresh-training"
              title="Refresh modules"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Modules Grid */}
        {loading ? (
          <div className="training-loading-card">
            <div className="training-spinner"></div>
            <p>Loading certified livestock training modules...</p>
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="training-empty-card">
            <div className="empty-icon-art">📭</div>
            <h3>No Training Modules Found</h3>
            <p>
              {searchTerm || filterCategory !== "all" || filterLanguage !== "all" || enrollFilter !== "all"
                ? "No training courses match your search or filter criteria. Try resetting filters."
                : "There are currently no training modules published."}
            </p>
            {(searchTerm || filterCategory !== "all" || filterLanguage !== "all" || enrollFilter !== "all") && (
              <button
                className="btn-reset-filters"
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("all");
                  setFilterLanguage("all");
                  setEnrollFilter("all");
                }}
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="user-modules-grid">
            {filteredModules.map((module) => {
              const meta = getCategoryMeta(module.category);
              const isEnrolled = isTrainingEnrolled(module._id);

              return (
                <div
                  key={module._id}
                  className={`user-module-card ${isEnrolled ? "is-enrolled-module" : ""}`}
                >
                  {/* Card Header Top */}
                  <div className="user-module-card-top">
                    <div className="module-badges-wrapper">
                      <span className="module-cat-badge">
                        {meta.icon} {meta.label.toUpperCase()}
                      </span>
                      <span className="module-lang-badge">
                        🌐 {module.language || "English"}
                      </span>
                    </div>

                    <span className="module-date-tag">
                      🕒 {formatDate(module.createdAt)}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="user-module-title">{module.title}</h3>
                  <p className="user-module-description">{module.description}</p>

                  {/* Content Snip */}
                  <div className="module-snip-box">
                    <span className="snip-label">Module Highlights:</span>
                    <p className="snip-text">{module.content}</p>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="user-module-footer">
                    <Link
                      to={`/trainingmodule/${module._id}`}
                      className="btn-start-learning"
                    >
                      📖 Read Full Module
                    </Link>

                    {/* Completion / Enrollment Action */}
                    <CreateUserTraning
                      traningId={module._id}
                      moduleTitle={module.title}
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

export { GetAllTraningModule, GetAllTraningModule as GetAllTrainingModules };
export default GetAllTraningModule;
