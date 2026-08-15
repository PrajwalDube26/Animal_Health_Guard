import React, { useState, useContext } from "react";
import { AlertContext } from "../../context/AlertContext";
import { useNavigate, Link } from "react-router-dom";
import "./CreateAlert.css";

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
  { value: "low", label: "Low (General Advisory)", color: "#10b981" },
  { value: "medium", label: "Medium (Moderate Risk)", color: "#f59e0b" },
  { value: "high", label: "High (Critical Outbreak)", color: "#ef4444" },
];

const CreateAlert = () => {
  const { createAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    district: "",
    location: "",
    farmType: "",
    severity: "low",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setAlertData({ ...alertData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!alertData.title.trim() || !alertData.message.trim()) {
      setErrorMsg("Please fill in both title and message.");
      return;
    }

    if (!alertData.district) {
      setErrorMsg("Please select a district.");
      return;
    }

    if (!alertData.farmType) {
      setErrorMsg("Please select a farm type.");
      return;
    }

    setLoading(true);

    try {
      const result = await createAlert(
        alertData.title.trim(),
        alertData.message.trim(),
        alertData.district,
        alertData.location.trim(),
        alertData.farmType,
        alertData.severity
      );

      if (result) {
        setSuccessMsg("Alert broadcasted successfully!");
        setAlertData({
          title: "",
          message: "",
          district: "",
          location: "",
          farmType: "",
          severity: "low",
        });
        setTimeout(() => {
          navigate("/fetchadminalert");
        }, 1200);
      } else {
        setErrorMsg("Failed to create alert. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-alert-container">
      <div className="create-alert-card">
        <div className="create-alert-header">
          <div className="alert-icon-badge">🚨</div>
          <div>
            <h2 className="create-alert-title">Create Emergency Health Alert</h2>
            <p className="create-alert-subtitle">
              Broadcast critical disease outbreaks or advisory alerts to registered farmers & officers
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="create-alert-form">
          {errorMsg && (
            <div className="alert-banner error-banner">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="alert-banner success-banner">
              ✅ {successMsg}
            </div>
          )}

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="alertTitle" className="form-label">
                Alert Title <span className="req">*</span>
              </label>
              <input
                type="text"
                id="alertTitle"
                name="title"
                placeholder="e.g. Foot and Mouth Disease Warning"
                value={alertData.title}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row two-cols">
            <div className="form-group">
              <label htmlFor="farmType" className="form-label">
                Target Farm / Animal Type <span className="req">*</span>
              </label>
              <select
                id="farmType"
                name="farmType"
                value={alertData.farmType}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select Animal Category</option>
                {FARM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)} Farming
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="severity" className="form-label">
                Severity Level <span className="req">*</span>
              </label>
              <select
                id="severity"
                name="severity"
                value={alertData.severity}
                onChange={handleChange}
                required
                className={`form-select severity-select ${alertData.severity}`}
              >
                {SEVERITIES.map((sev) => (
                  <option key={sev.value} value={sev.value}>
                    {sev.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row two-cols">
            <div className="form-group">
              <label htmlFor="district" className="form-label">
                District (Maharashtra) <span className="req">*</span>
              </label>
              <select
                id="district"
                name="district"
                value={alertData.district}
                onChange={handleChange}
                required
                className="form-select"
              >
                <option value="">Select District</option>
                {DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Specific Location / Taluka / Village <span className="req">*</span>
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g. Haveli Taluka, Hadapsar Region"
                value={alertData.location}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="alertMessage" className="form-label">
                Alert Advisory Message & Instructions <span className="req">*</span>
              </label>
              <textarea
                id="alertMessage"
                name="message"
                rows="4"
                placeholder="Provide detailed symptoms, preventive measures, vaccination schedules, or biosecurity guidelines..."
                value={alertData.message}
                onChange={handleChange}
                required
                className="form-textarea"
              />
            </div>
          </div>

          <div className="form-actions">
            <Link to="/fetchadminalert" className="btn-secondary">
              Cancel & View Alerts
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary-create"
            >
              {loading ? "Publishing Alert..." : "🚨 Broadcast Alert Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAlert;
