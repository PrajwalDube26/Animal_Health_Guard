import { createContext, useState } from "react";

export const UserAlertContext = createContext();

export const UserAlertProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "/User_Alert";
  const [userAlerts, setUserAlerts] = useState([]);

  // Create User Alert / Mark as Read
  const createUserAlert = async (alertId) => {
    try {
      const response = await fetch(`${BASE_URL}/create_User_Alert/${alertId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ alertId }),
      });

      const json = await response.json();

      if (!response.ok) {
        // If already marked as read, still return informative state
        if (response.status === 409) {
          if (json.userAlert) {
            setUserAlerts((prev) => {
              const exists = prev.some(
                (item) => (item.alertId?._id || item.alertId) === alertId
              );
              return exists ? prev : [...prev, json.userAlert];
            });
          }
        }
        return { success: false, message: json.message, status: response.status };
      }

      const created = json.userAlert || json;
      setUserAlerts((prev) => [...prev, created]);
      return { success: true, userAlert: created };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
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

  // Delete user alert by alertId / unmark as read
  const unmarkAlertAsRead = async (alertId) => {
    try {
      const response = await fetch(`${BASE_URL}/delete_user_alert/${alertId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        return false;
      }

      setUserAlerts((prev) =>
        prev.filter(
          (item) =>
            (item.alertId?._id || item.alertId) !== alertId && item._id !== alertId
        )
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Helper function to check if an alert is read
  const isAlertRead = (alertId) => {
    return userAlerts.some(
      (item) => (item.alertId?._id || item.alertId) === alertId
    );
  };

  return (
    <UserAlertContext.Provider
      value={{
        createUserAlert,
        getUserAlertByUserId,
        getUserAlertByAlertId,
        deleteUserAlertByUserId,
        unmarkAlertAsRead,
        isAlertRead,
        userAlerts,
        setUserAlerts,
      }}
    >
      {children}
    </UserAlertContext.Provider>
  );
};

export default UserAlertProvider;
