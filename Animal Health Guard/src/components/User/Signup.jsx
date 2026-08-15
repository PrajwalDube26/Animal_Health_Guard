import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import "./Signup.css";

const Signup = () => {
  const { Signup } = useContext(UserContext);

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      await Signup(
        credentials.name,
        credentials.email,
        credentials.password,
        credentials.phone,
        credentials.location
      );

      setCredentials({
        name: "",
        email: "",
        password: "",
        phone: "",
        location: "",
      });
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
          <h2>Create Account</h2>
          <p>Create your account to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">

          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={credentials.name}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={onChange}
              className="form-input"
              required
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={credentials.phone}
              onChange={onChange}
              className="form-input"
              placeholder="9876543210"
              required
            />
          </div>

          {/* Location */}
          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={credentials.location}
              onChange={onChange}
              className="form-input"
              placeholder="Pune"
              required
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={onChange}
                className="form-input"
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
            className="signup-button"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <div className="signup-footer">
          Already have an account?
          <a href="/login"> Login</a>
        </div>

      </div>
    </div>
  );
};

export default Signup;