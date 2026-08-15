import React, { useState, useEffect, useContext } from "react";
import { AlertContext } from "../../context/AlertContext";
import "./UpdateAlert.css";

const DISTRICTS = [
  "Ahilyanagar", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", "Chandrapur",
  "Chhatrapati Sambhajinagar", "Dharashiv", "Dhule", "Gadchiroli", "Gondia",
  "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City",
  "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Palghar",
  "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
  "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
];

const FARM_TYPES = ["dairy", "poultry", "goat", "sheep", "pig"];
const SEVERITIES = [
  { value: "low", label: "Low (General Advisory)" },
  { value: "medium", label: "Medium (Moderate Risk)" },
  { value: "high", label: "High (Critical Outbreak)" },
];

const UpdateAlert = ({ show = true, alertToEdit, onClose, onAlertUpdated }) => {
  const { updateAlert } = useContext(AlertContext);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    district: "",
    location: "",
    farmType: "dairy",
    severity: "low",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (alertToEdit) {
      setFormData({
        title: alertToEdit.title || "",
        message: alertToEdit.message || "",
        district: alertToEdit.district || "",
        location: alertToEdit.location || "",
        farmType: alertToEdit.farmType || "dairy",
        severity: alertToEdit.severity || "low",
      });
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [alertToEdit]);

  if (!show || !alertToEdit) return null;

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

    if (!formData.title.trim() || !formData.message.trim()) {
      setErrorMsg("Title and Message cannot be empty.");
      return;
    }

    if (!formData.district) {
      setErrorMsg("Please select a valid district.");
      return;
    }

    setLoading(true);

    try {
      const updated = await updateAlert(
        alertToEdit._id,
        formData.title.trim(),
        formData.message.trim(),
        formData.district,
        formData.location.trim(),
        formData.farmType,
        formData.severity
      );

      if (updated) {
        setSuccessMsg("Alert updated successfully!");
        if (onAlertUpdated) {
          onAlertUpdated(updated);
        }
        setTimeout(() => {
          if (onClose) onClose();
        }, 1000);
      } else {
        setErrorMsg("Failed to update alert. Please verify details and try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred while updating.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="update-modal-backdrop" onClick={onClose}>
      <div
        className="update-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="update-modal-content">
          {/* Header */}
          <div className="update-modal-header">
            <div className="modal-title-group">
              <span className="modal-title-icon">✏️</span>
              <div>
                <h3 className="modal-title">Update Alert Details</h3>
                <span className="modal-subtitle">
                  Editing Alert ID: <span className="mono-id">{alertToEdit._id}</span>
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
            <div className="update-modal-body">
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
                  Alert Title <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  className="modal-input"
                  placeholder="Enter alert title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label className="modal-label">
                    Animal / Farm Type <span className="req">*</span>
                  </label>
                  <select
                    name="farmType"
                    className="modal-select"
                    value={formData.farmType}
                    onChange={handleChange}
                    required
                  >
                    {FARM_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-form-group">
                  <label className="modal-label">
                    Severity Level <span className="req">*</span>
                  </label>
                  <select
                    name="severity"
                    className={`modal-select severity-tag ${formData.severity}`}
                    value={formData.severity}
                    onChange={handleChange}
                    required
                  >
                    {SEVERITIES.map((sev) => (
                      <option key={sev.value} value={sev.value}>
                        {sev.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-form-row">
                <div className="modal-form-group">
                  <label className="modal-label">
                    District <span className="req">*</span>
                  </label>
                  <select
                    name="district"
                    className="modal-select"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select District</option>
                    {DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-form-group">
                  <label className="modal-label">
                    Specific Location / Taluka <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    className="modal-input"
                    placeholder="e.g. Haveli, Baramati"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="modal-form-group">
                <label className="modal-label">
                  Advisory Message & Guidance <span className="req">*</span>
                </label>
                <textarea
                  name="message"
                  rows="4"
                  className="modal-textarea"
                  placeholder="Update preventive instructions, treatments, or notice details..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Footer */}
            <div className="update-modal-footer">
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

export default UpdateAlert;
