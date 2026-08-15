import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const DISTRICTS = [
  "Ahilyanagar", "Akola", "Amravati", "Beed", "Bhandara", "Buldhana", "Chandrapur",
  "Chhatrapati Sambhajinagar", "Dharashiv", "Dhule", "Gadchiroli", "Gondia",
  "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City",
  "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Palghar",
  "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara",
  "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"
];

const Signup = () => {
  const { adminSignup } = useContext(AdminContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    district: "",
    location: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await adminSignup(
        credentials.name,
        credentials.email,
        credentials.password,
        credentials.phone,
        credentials.district,
        credentials.location
      );

      if (success) {
        setCredentials({
          name: "",
          email: "",
          password: "",
          phone: "",
          district: "",
          location: "",
        });
        navigate("/profile");
      }
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  const onChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h2 className="signup-title">Admin Registration</h2>
          <p className="signup-subtitle">Create your admin authority account</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={credentials.name}
              onChange={onChange}
              className="form-input"
              placeholder="e.g. Officer Name"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Official Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              className="form-input"
              placeholder="admin@gov.in"
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={credentials.phone}
              onChange={onChange}
              className="form-input"
              placeholder="10-digit mobile number"
              maxLength={10}
              required
            />
          </div>

          {/* District */}
          <div className="form-group">
            <label className="form-label">District (Maharashtra)</label>
            <select
              name="district"
              value={credentials.district}
              onChange={onChange}
              className="form-select"
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
          <div className="form-group">
            <label className="form-label">HQ / Location</label>
            <input
              type="text"
              name="location"
              value={credentials.location}
              onChange={onChange}
              className="form-input"
              placeholder="e.g. Pune Central Office"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={onChange}
                className="form-input"
                placeholder="Minimum 6 characters"
                required
                minLength={6}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`signup-button ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Registering...
              </>
            ) : (
              "Create Admin Account"
            )}
          </button>
        </form>

        <div className="signup-footer">
          <p className="signup-login-text">
            Already registered?{" "}
            <Link to="/login" className="signup-login-link">
              Admin Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
