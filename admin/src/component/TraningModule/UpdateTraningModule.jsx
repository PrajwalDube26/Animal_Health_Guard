import React, { useState, useEffect, useContext } from "react";
import { TrainingModuleContext } from "../../context/TrainingModuleContext";
import "./UpdateTraningModule.css";

const CATEGORIES = [
  { value: "dairy", label: "🐄 Dairy Management & Milking" },
  { value: "poultry", label: "🐔 Poultry Care & Vaccination" },
  { value: "goat", label: "🐐 Goat Farming & Breeding" },
  { value: "sheep", label: "🐑 Sheep Rearing & Wool Care" },
  { value: "pig", label: "🐖 Piggery & Feed Sanitation" },
  { value: "biosecurity", label: "🛡️ Biosecurity & Disinfection" },
  { value: "general", label: "🌾 General Veterinary Advisory" },
];

const LANGUAGES = ["English", "Marathi (मराठी)", "Hindi (हिंदी)"];

const UpdateTraningModule = ({ show = true, moduleToEdit, onClose, onModuleUpdated }) => {
  const { updateTrainingModule } = useContext(TrainingModuleContext);

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

  useEffect(() => {
    if (moduleToEdit) {
      setFormData({
        title: moduleToEdit.title || "",
        description: moduleToEdit.description || "",
        content: moduleToEdit.content || "",
        category: moduleToEdit.category || "dairy",
        language: moduleToEdit.language || "English",
      });
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [moduleToEdit]);

  if (!show || !moduleToEdit) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.title.trim() || !formData.description.trim() || !formData.content.trim()) {
      setErrorMsg("All title, summary, and content fields are required.");
      return;
    }

    setLoading(true);

    try {
      const updated = await updateTrainingModule(
        moduleToEdit._id,
        formData.title.trim(),
        formData.description.trim(),
        formData.content.trim(),
        formData.category,
        formData.language
      );

      if (updated) {
        setSuccessMsg("Training module updated successfully!");
        if (onModuleUpdated) {
          onModuleUpdated(updated);
        }
        setTimeout(() => {
          if (onClose) onClose();
        }, 1000);
      } else {
        setErrorMsg("Failed to update module. Please verify details.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-training-modal-backdrop" onClick={onClose}>
      <div
        className="update-training-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="update-training-modal-content">
          {/* Header */}
          <div className="update-training-modal-header">
            <div className="modal-title-group">
              <span className="modal-title-icon">✏️</span>
              <div>
                <h3 className="modal-title">Update Training Module</h3>
                <span className="modal-subtitle">
                  Module ID: <span className="mono-id">{moduleToEdit._id}</span>
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
            <div className="update-training-modal-body">
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

              <div className="modal-form-group">
                <label className="modal-label">
                  Module Title <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="modal-input"
                  placeholder="Enter module title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label className="modal-label">
                    Category <span className="req">*</span>
                  </label>
                  <select
                    name="category"
                    className="modal-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-form-group">
                  <label className="modal-label">
                    Language <span className="req">*</span>
                  </label>
                  <select
                    name="language"
                    className="modal-select"
                    value={formData.language}
                    onChange={handleChange}
                    required
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-form-group">
                <label className="modal-label">
                  Brief Summary / Overview <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="description"
                  className="modal-input"
                  placeholder="Brief summary of key objectives"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-form-group">
                <label className="modal-label">
                  Training Content & Instructions <span className="req">*</span>
                </label>
                <textarea
                  name="content"
                  rows="6"
                  className="modal-textarea"
                  placeholder="Step-by-step instructions, veterinary guidance, dos & don'ts..."
                  value={formData.content}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Footer */}
            <div className="update-training-modal-footer">
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
                disabled={loading}
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

export default UpdateTraningModule;
