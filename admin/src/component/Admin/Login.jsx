import React, { useContext, useState } from "react";
import { AdminContext } from "../../context/AdminContext";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const Login = () => {
  const { adminLogin } = useContext(AdminContext);
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await adminLogin(credentials.email, credentials.password);

      if (success) {
        setCredentials({
          email: "",
          password: "",
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
          <h2 className="signup-title">Admin Portal</h2>
          <p className="signup-subtitle">Sign in to manage disease alerts and farms</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="admin@gov.in"
              value={credentials.email}
              onChange={onChange}
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
                className="form-input"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={onChange}
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
                Signing In...
              </>
            ) : (
              "Admin Sign In"
            )}
          </button>
        </form>

        <div className="signup-footer">
          <p className="signup-login-text">
            Need an admin account?{" "}
            <Link to="/signup" className="signup-login-link">
              Register Admin
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
