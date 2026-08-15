import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import "./Updateadmin.css";

const DISTRICTS = [
  "Ahilyanagar", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", "Chandrapur",
  "Chhatrapati Sambhajinagar", "Dharashiv", "Dhule", "Gadchiroli", "Gondia",
  "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City",
  "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Palghar",
  "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
  "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
];

const Updateadmin = ({ show = true, onClose }) => {
  const { adminDetail, updateAdmin, getAdmin } = useContext(AdminContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    district: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (getAdmin) {
      getAdmin();
    }
  }, []);

  useEffect(() => {
    if (adminDetail) {
      setFormData({
        name: adminDetail.name || "",
        phone: adminDetail.phone || "",
        district: adminDetail.district || "",
        location: adminDetail.location || "",
      });
    }
    setErrorMsg("");
    setSuccessMsg("");
  }, [adminDetail]);

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

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMsg("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!formData.name.trim()) {
      setErrorMsg("Name cannot be empty.");
      return;
    }

    if (!formData.district) {
      setErrorMsg("Please select your administrative district.");
      return;
    }

    setLoading(true);

    try {
      const success = await updateAdmin(
        formData.name,
        formData.phone,
        formData.district,
        formData.location
      );

      if (success) {
        setSuccessMsg("Admin profile updated successfully!");
        if (getAdmin) {
          await getAdmin();
        }
        setTimeout(() => {
          if (onClose) {
            onClose();
          } else {
            navigate("/profile");
          }
        }, 1200);
      } else {
        setErrorMsg("Failed to update admin profile. Please try again.");
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
    <div className="updateadmin-container">
      <div className="update-admin-card">
        <div className="update-card-header">
          <div className="header-text-wrapper">
            <h2 className="update-title">Update Admin Profile</h2>
            <p className="update-subtitle">Edit administrative information below</p>
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
              <label htmlFor="adminEmail" className="form-label-custom">
                Official Email <span className="read-only-badge">Read-Only</span>
              </label>
              <input
                type="email"
                id="adminEmail"
                className="form-control-custom read-only-input"
                value={adminDetail?.email || ""}
                disabled
              />
            </div>

            {/* Name */}
            <div className="form-group-custom">
              <label htmlFor="adminName" className="form-label-custom">
                Full Name <span className="required-star">*</span>
              </label>
              <input
                type="text"
                id="adminName"
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
              <label htmlFor="adminPhone" className="form-label-custom">
                Phone Number <span className="required-star">*</span>
              </label>
              <input
                type="tel"
                id="adminPhone"
                name="phone"
                className="form-control-custom"
                placeholder="10-digit mobile number"
                value={formData.phone}
                onChange={handleChange}
                maxLength={10}
                required
              />
              <span className="field-hint">Must be 10 digits (e.g. 9876543210)</span>
            </div>

            {/* District */}
            <div className="form-group-custom">
              <label htmlFor="adminDistrict" className="form-label-custom">
                District (Maharashtra) <span className="required-star">*</span>
              </label>
              <select
                id="adminDistrict"
                name="district"
                className="form-control-custom form-select-custom"
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

            {/* Location */}
            <div className="form-group-custom">
              <label htmlFor="adminLocation" className="form-label-custom">
                HQ / Office Location
              </label>
              <input
                type="text"
                id="adminLocation"
                name="location"
                className="form-control-custom"
                placeholder="e.g. Pune Central Office"
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

export default Updateadmin;
