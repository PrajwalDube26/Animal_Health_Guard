import React, { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./Updateuser.css";

const Updateuser = ({ show = true, onClose }) => {
  const { user_detail, updateUser, getUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Ensure user data is loaded
  useEffect(() => {
    if (getUser) {
      getUser();
    }
  }, []);

  // Populate form with current user details
  useEffect(() => {
    if (user_detail) {
      setFormData({
        name: user_detail.name || "",
        phone: user_detail.phone || "",
        location: user_detail.location || "",
      });
    }
    setErrorMsg("");
    setSuccessMsg("");
  }, [user_detail]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMsg("");
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/profile");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // Validate phone: 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMsg("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!formData.name.trim()) {
      setErrorMsg("Name cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const success = await updateUser(
        formData.name,
        formData.phone,
        formData.location
      );

      if (success) {
        setSuccessMsg("Profile updated successfully!");
        if (getUser) {
          await getUser();
        }
        setTimeout(() => {
          if (onClose) {
            onClose();
          } else {
            navigate("/profile");
          }
        }, 1200);
      } else {
        setErrorMsg("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="updateuser-container">
      <div className="update-user-card">
        <div className="update-card-header">
          <div className="header-text-wrapper">
            <h2 className="update-title">Update Profile</h2>
            <p className="update-subtitle">Edit your personal details below</p>
          </div>
          <button
            type="button"
            className="btn-back-icon"
            aria-label="Back to Profile"
            onClick={handleCancel}
            title="Back to Profile"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="update-form">
          <div className="update-form-body">
            {errorMsg && (
              <div className="custom-alert alert-danger" role="alert">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="custom-alert alert-success" role="alert">
                {successMsg}
              </div>
            )}

            {/* Email (Read Only) */}
            <div className="form-group-custom">
              <label htmlFor="userEmail" className="form-label-custom">
                Email Address <span className="read-only-badge">Read-Only</span>
              </label>
              <input
                type="email"
                id="userEmail"
                className="form-control-custom read-only-input"
                value={user_detail?.email || ""}
                disabled
              />
            </div>

            {/* Name */}
            <div className="form-group-custom">
              <label htmlFor="userName" className="form-label-custom">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="userName"
                name="name"
                className="form-control-custom"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group-custom">
              <label htmlFor="userPhone" className="form-label-custom">
                Phone Number <span className="required-star">*</span>
              </label>
              <input
                type="tel"
                id="userPhone"
                name="phone"
                className="form-control-custom"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                required
              />
              <span className="field-hint">
                Must be 10 digits (e.g. 9876543210)
              </span>
            </div>

            {/* Location */}
            <div className="form-group-custom">
              <label htmlFor="userLocation" className="form-label-custom">
                Location / Farm Area
              </label>
              <input
                type="text"
                id="userLocation"
                name="location"
                className="form-control-custom"
                placeholder="e.g. Pune, Maharashtra"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="update-form-footer">
            <button
              type="button"
              className="modal-btn modal-btn-cancel"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="modal-btn modal-btn-save"
              disabled={loading}
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Updateuser;
