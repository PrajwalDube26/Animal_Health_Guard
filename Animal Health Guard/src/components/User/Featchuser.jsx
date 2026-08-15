import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import "./featchuser.css";

const FeatchUser = () => {
    const { getUser, user_detail, Logout } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        getUser();
    }, []);

    const getInitials = (name) => {
        if (!name) return "U";

        return name
            .split(" ")
            .map(word => word[0])
            .join("")
            .toUpperCase();
    };

    const formatDate = (date) => {
        if (!date) return "Not Available";

        return new Date(date).toLocaleDateString();
    };

    return (
        <div className="profile-container">

            <div className="profile-card">

                {/* Avatar */}

                <div className="profile-header">

                    <div className="profile-avatar">
                        {getInitials(user_detail?.name)}
                    </div>

                    <h2 className="profile-name">
                        {user_detail?.name || "User"}
                    </h2>

                    <p className="profile-role">
                        Farmer
                    </p>

                </div>

                {/* Details */}

                <div className="profile-details">

                    <div className="detail-item">
                        <span className="detail-label">
                            Email
                        </span>

                        <span className="detail-value">
                            {user_detail?.email || "Not Available"}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Phone
                        </span>

                        <span className="detail-value">
                            {user_detail?.phone || "Not Available"}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Location
                        </span>

                        <span className="detail-value">
                            {user_detail?.location || "Not Available"}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Member Since
                        </span>

                        <span className="detail-value">
                            {formatDate(user_detail?.createdAt)}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            User ID
                        </span>

                        <span className="detail-value">
                            {user_detail?._id || "Not Available"}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Logout
                        </span>

                        <span className="detail-value">
                            <button onClick={Logout} className="action-btn secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}>
                                Logout
                            </button>
                        </span>
                    </div>

                </div>

                {/* Buttons */}

                <div className="profile-actions">

                    <Link to="/updateuser" className="action-btn primary" style={{ textDecoration: "none", textAlign: "center" }}>
                        Edit Profile
                    </Link>

                    <Link to="/getfarm" className="action-btn secondary" style={{ textDecoration: "none", textAlign: "center" }}>
                        My Farms
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default FeatchUser;
