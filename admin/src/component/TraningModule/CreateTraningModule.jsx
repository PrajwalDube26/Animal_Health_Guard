import React, { useState, useContext } from "react";
import { TrainingModuleContext } from "../../context/TrainingModuleContext";
import { useNavigate, Link } from "react-router-dom";
import "./CreateTraningModule.css";

const CATEGORIES = [
  { value: "dairy", label: "🐄 Dairy Management & Milking", icon: "🐄" },
  { value: "poultry", label: "🐔 Poultry Care & Vaccination", icon: "🐔" },
  { value: "goat", label: "🐐 Goat Farming & Breeding", icon: "🐐" },
  { value: "sheep", label: "🐑 Sheep Rearing & Wool Care", icon: "🐑" },
  { value: "pig", label: "🐖 Piggery & Feed Sanitation", icon: "🐖" },
  { value: "biosecurity", label: "🛡️ Biosecurity & Disinfection", icon: "🛡️" },
  { value: "general", label: "🌾 General Veterinary Advisory", icon: "🌾" },
];

const LANGUAGES = ["English", "Marathi (मराठी)", "Hindi (हिंदी)"];

const CreateTraningModule = () => {
  const { createTrainingModule } = useContext(TrainingModuleContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "dairy",
    language: "English",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.title.trim() || !formData.description.trim() || !formData.content.trim()) {
      setErrorMsg("Please fill in all required title, summary, and content fields.");
      return;
    }

    setLoading(true);

    try {
      const result = await createTrainingModule(
        formData.title.trim(),
        formData.description.trim(),
        formData.content.trim(),
        formData.category,
        formData.language
      );

      if (result) {
        setSuccessMsg("Training module published successfully!");
        setFormData({
          title: "",
          description: "",
          content: "",
          category: "dairy",
          language: "English",
        });
        setTimeout(() => {
          navigate("/fetchadmintrainingmodule");
        }, 1200);
      } else {
        setErrorMsg("Failed to create training module. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-training-container">
      <div className="create-training-card">
        <div className="create-training-header">
          <div className="training-icon-badge">🎓</div>
          <div>
            <h2 className="create-training-title">Publish Livestock Training Module</h2>
            <p className="create-training-subtitle">
              Create educational guidelines, best practices, and farming manuals for registered farmers
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="create-training-form">
          {errorMsg && (
            <div className="training-banner error-banner">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="training-banner success-banner">
              ✅ {successMsg}
            </div>
          )}

          <div className="training-form-row">
            <div className="training-form-group full-width">
              <label htmlFor="moduleTitle" className="training-form-label">
                Module Title <span className="req">*</span>
              </label>
              <input
                type="text"
                id="moduleTitle"
                name="title"
                placeholder="e.g. Modern Mastitis Prevention & Clean Milk Production"
                value={formData.title}
                onChange={handleChange}
                required
                className="training-input"
              />
            </div>
          </div>

          <div className="training-form-row two-cols">
            <div className="training-form-group">
              <label htmlFor="category" className="training-form-label">
                Livestock / Farming Category <span className="req">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="training-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="training-form-group">
              <label htmlFor="language" className="training-form-label">
                Instruction Language <span className="req">*</span>
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                required
                className="training-select"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="training-form-row">
            <div className="training-form-group full-width">
              <label htmlFor="description" className="training-form-label">
                Brief Overview & Objective <span className="req">*</span>
              </label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Short summary highlighting what farmers will learn in this session..."
                value={formData.description}
                onChange={handleChange}
                required
                className="training-input"
              />
            </div>
          </div>

          <div className="training-form-row">
            <div className="training-form-group full-width">
              <label htmlFor="content" className="training-form-label">
                Detailed Training Content & Instructions <span className="req">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                rows="6"
                placeholder="Provide detailed step-by-step procedures, feed rations, medicinal doses, hygiene practices, and preventive warnings..."
                value={formData.content}
                onChange={handleChange}
                required
                className="training-textarea"
              />
            </div>
          </div>

          <div className="training-form-actions">
            <Link to="/fetchadmintrainingmodule" className="btn-training-secondary">
              Cancel & View Modules
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-training-primary"
            >
              {loading ? "Publishing Module..." : "🎓 Publish Training Module"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTraningModule;
