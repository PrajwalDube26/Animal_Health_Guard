import { createContext, useState } from "react";

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const BASE_URL = "http://localhost:5000/api/alert";
  const [alerts, setalerts] = useState([]);

  // Create Alert (Admin)
  const createAlert = async (title, message, district, location, farmType, severity) => {
    try {
      const response = await fetch(`${BASE_URL}/create_alert`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          message,
          district,
          location,
          farmType,
          severity,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setalerts((prev) => [...prev, json.alert]);
      return json.alert;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Get Alert by Admin ID
  const getAlertByAdminId = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get_alert_by_adminid`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        setalerts([]);
        return [];
      }

      setalerts(json.alerts || []);
      return json.alerts;
    } catch (error) {
      console.log(error);
      setalerts([]);
      return [];
    }
  };

  // Get Alert by Alert ID
  const getAlertById = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/get_alert_by_alertid/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        return null;
      }

      return json.alert;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Get All Alerts
  const getAllAlerts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get_all_alerts`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        setalerts([]);
        return [];
      }

      setalerts(json.alerts || []);
      return json.alerts;
    } catch (error) {
      console.log(error);
      setalerts([]);
      return [];
    }
  };

  // Delete Alert (Admin)
  const deleteAlert = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/delete_alert_by_alertid/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setalerts((prev) => prev.filter((alertItem) => alertItem._id !== id));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Update Alert (Admin)
  const updateAlert = async (id, title, message, district, location, farmType, severity) => {
    try {
      const response = await fetch(`${BASE_URL}/update_alert_by_alertid/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          message,
          district,
          location,
          farmType,
          severity,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setalerts((prev) =>
        prev.map((alertItem) => (alertItem._id === id ? json.alert : alertItem))
      );
      return json.alert;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <AlertContext.Provider
      value={{
        createAlert,
        getAlertByAdminId,
        getAlertById,
        getAllAlerts,
        deleteAlert,
        updateAlert,
        alerts,
        setalerts,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};
