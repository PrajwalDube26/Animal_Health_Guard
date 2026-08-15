import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

const Login = () => {

    const { Login } = useContext(UserContext);

    const navigate = useNavigate();

    const [credentials, setCredentials] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);

        try {

            await Login(
                credentials.email,
                credentials.password
            );

            setCredentials({
                email: "",
                password: ""
            });

            navigate("/profile");

        } catch (error) {
            console.log(error);
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
                    <h2 className="signup-title">
                        Welcome Back
                    </h2>

                    <p className="signup-subtitle">
                        Login to Digital Farm Management Portal
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="signup-form"
                >

                    {/* Email */}

                    <div className="form-group">

                        <label className="form-label">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter your email"
                            value={credentials.email}
                            onChange={onChange}
                            required
                        />

                    </div>

                    {/* Password */}

                    <div className="form-group">

                        <label className="form-label">
                            Password
                        </label>

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
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
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
                            "Sign In"
                        )}
                    </button>

                </form>

                <div className="signup-footer">

                    <p className="signup-login-text">

                        Don't have an account?

                        {" "}

                        <Link
                            to="/signup"
                            className="signup-login-link"
                        >
                            Register
                        </Link>

                    </p>

                </div>

            </div>

        </div>
    );
};

export default Login;