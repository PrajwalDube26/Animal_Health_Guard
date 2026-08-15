import { createContext, useState } from "react";

export const UserAlertContext = createContext();

export const UserAlertProvider = ({ children }) => {
  const BASE_URL = "http://localhost:5000/api/User_Alert";
  const [userAlerts, setUserAlerts] = useState([]);

  // Assign/Create User Alert
  const createUserAlert = async (alertId) => {
    try {
      const response = await fetch(`${BASE_URL}/create_User_Alert/${alertId}`, {
        method: "POST",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      const created = json.userAlert || json;
      setUserAlerts((prev) => [...prev, created]);
      return created;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Get User Alerts for logged-in user
  const getUserAlertByUserId = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get_User_Alert_By_UserId`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        setUserAlerts([]);
        return [];
      }

      const list = json.userAlert || json.userAlerts || [];
      setUserAlerts(list);
      return list;
    } catch (error) {
      console.log(error);
      setUserAlerts([]);
      return [];
    }
  };

  // Get User Alert by alertId
  const getUserAlertByAlertId = async (alertId) => {
    try {
      const response = await fetch(`${BASE_URL}/get_User_Alert_By_alertId/${alertId}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        return [];
      }

      return json.userAlert || json.userAlerts || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // Delete all user alerts for logged-in user
  const deleteUserAlertByUserId = async () => {
    try {
      const response = await fetch(`${BASE_URL}/delete_User_Alert_By_UserId`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setUserAlerts([]);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Delete user alert by alertId
  const deleteUserAlertByAlertId = async (alertId) => {
    try {
      const response = await fetch(`${BASE_URL}/delete_User_Alert_By_alertId/${alertId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setUserAlerts((prev) =>
        prev.filter((item) => item.alertId !== alertId && item._id !== alertId)
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <UserAlertContext.Provider
      value={{
        createUserAlert,
        getUserAlertByUserId,
        getUserAlertByAlertId,
        deleteUserAlertByUserId,
        deleteUserAlertByAlertId,
        userAlerts,
        setUserAlerts,
      }}
    >
      {children}
    </UserAlertContext.Provider>
  );
};
