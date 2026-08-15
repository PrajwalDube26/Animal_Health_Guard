import React, { useContext, useEffect } from "react";
import { Link } from 'react-router-dom';
import { UserContext } from "../../context/UserContext";
import "./featchuser.css";

const FeatchUser = () => {

    const { getUser, user_detail, Logout } = useContext(UserContext);

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
                        {getInitials(user_detail.name)}
                    </div>

                    <h2 className="profile-name">
                        {user_detail.name}
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
                            {user_detail.email}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Phone
                        </span>

                        <span className="detail-value">
                            {user_detail.phone}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Location
                        </span>

                        <span className="detail-value">
                            {user_detail.location}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Member Since
                        </span>

                        <span className="detail-value">
                            {formatDate(user_detail.createdAt)}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            User ID
                        </span>

                        <span className="detail-value">
                            {user_detail._id}
                        </span>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">
                            Logout
                        </span>

                        <span className="detail-value">
                            <button onClick={Logout} >
                                Logout
                            </button>
                        </span>
                    </div>

                </div>

                {/* Buttons */}

                <div className="profile-actions">

                    <button className="action-btn primary">
                        Edit Profile
                    </button>

                    <button className="action-btn secondary">
                        My Farms
                    </button>

                </div>

            </div>

        </div>
    );
};

export default FeatchUser;