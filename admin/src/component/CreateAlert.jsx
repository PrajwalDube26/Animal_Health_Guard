import React, { useState, useContext } from "react";
import { AlertContext } from "../context/AlertContext";
import { useNavigate } from "react-router-dom";

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

  const handleChange = (e) => {
    setAlertData({ ...alertData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await createAlert(
      alertData.title,
      alertData.message,
      alertData.district,
      alertData.location,
      alertData.farmType,
      alertData.severity
    );

    if (result) {
      alert("Alert created successfully!");
      navigate("/");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "auto" }}>
      <h2>Create Alert</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={alertData.title}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label>Message</label>
          <textarea
            name="message"
            value={alertData.message}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label>District</label>
          <input
            type="text"
            name="district"
            value={alertData.district}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={alertData.location}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div>
          <label>Farm Type</label>
          <select
            name="farmType"
            value={alertData.farmType}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="">Select Farm Type</option>
            <option value="dairy">dairy</option>
            <option value="poultry">poultry</option>
            <option value="goat">goat</option>
            <option value="sheep">sheep</option>
            <option value="pig">pig</option>
          </select>
        </div>

        <div>
          <label>Severity</label>
          <select
            name="severity"
            value={alertData.severity}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <button type="submit" style={{ padding: "0.75rem", cursor: "pointer" }}>
          Create Alert
        </button>
      </form>
    </div>
  );
};

export default CreateAlert;
