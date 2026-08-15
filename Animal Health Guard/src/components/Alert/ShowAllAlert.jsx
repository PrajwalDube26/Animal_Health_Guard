import React, { useContext, useEffect } from "react";
import { AlertContext } from "../../context/AlertContext";
import "./ShowAllAlert.css";

const ShowAllAlert = () => {
  const { getAllAlerts, alerts } = useContext(AlertContext);

  useEffect(() => {
    getAllAlerts();
  }, []);

  return (
    <div className="alerts-container">
      <div className="alerts-header">
        <div>
          <h1>All Alerts</h1>
          <p>Stay updated with important farm and disease alerts.</p>
        </div>
      </div>

      {alerts && alerts.length > 0 ? (
        <div className="alerts-grid">
          {alerts.map((alert) => (
            <div
              className={`alert-card ${alert.severity?.toLowerCase()}`}
              key={alert._id}
            >
              <div className="alert-card-header">
                <h2>{alert.title}</h2>

                <span
                  className={`severity-badge ${alert.severity?.toLowerCase()}`}
                >
                  {alert.severity}
                </span>
              </div>

              <p className="alert-message">{alert.message}</p>

              <div className="alert-details">
                {alert.district && (
                  <p>
                    <strong>District:</strong> {alert.district}
                  </p>
                )}

                {alert.diseaseType && (
                  <p>
                    <strong>Disease Type:</strong> {alert.diseaseType}
                  </p>
                )}

                {alert.location && (
                  <p>
                    <strong>Location:</strong> {alert.location}
                  </p>
                )}

                {alert.createdAt && (
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-alerts">
          <h2>No Alerts Found</h2>
          <p>There are currently no alerts available.</p>
        </div>
      )}
    </div>
  );
};

export default ShowAllAlert;