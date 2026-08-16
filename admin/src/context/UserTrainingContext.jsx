import { createContext, useState } from "react";

export const UserTrainingContext = createContext();

export const UserTrainingProvider = ({ children }) => {
  const BASE_URL = process.env.BASE_URL + "/user_traning";
  const [userTrainings, setUserTrainings] = useState([]);

  // Assign/Create User Training
  const createUserTraining = async (traningId) => {
    try {
      const response = await fetch(`${BASE_URL}/create_user_traning/${traningId}`, {
        method: "POST",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      const created = json.userTraning || json.userTraining || json;
      setUserTrainings((prev) => [...prev, created]);
      return created;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Get User Training by logged-in User ID
  const getUserTrainingByUserId = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get_user_traning`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        setUserTrainings([]);
        return [];
      }

      const list = json.userTraning || json.userTrainings || [];
      setUserTrainings(list);
      return list;
    } catch (error) {
      console.log(error);
      setUserTrainings([]);
      return [];
    }
  };

  // Get User Training by training ID
  const getUserTrainingByTrainingId = async (traningId) => {
    try {
      const response = await fetch(`${BASE_URL}/get_user_traning/${traningId}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        return [];
      }

      return json.userTraning || json.userTrainings || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // Delete all User Training assignments for logged-in user
  const deleteUserTrainingByUserId = async () => {
    try {
      const response = await fetch(`${BASE_URL}/delete_user_traning`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setUserTrainings([]);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Delete User Training by training ID
  const deleteUserTrainingByTrainingId = async (traningId) => {
    try {
      const response = await fetch(`${BASE_URL}/delete_user_traning/${traningId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setUserTrainings((prev) =>
        prev.filter((item) => item.traningId !== traningId && item._id !== traningId)
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <UserTrainingContext.Provider
      value={{
        createUserTraining,
        getUserTrainingByUserId,
        getUserTrainingByTrainingId,
        deleteUserTrainingByUserId,
        deleteUserTrainingByTrainingId,
        userTrainings,
        setUserTrainings,
      }}
    >
      {children}
    </UserTrainingContext.Provider>
  );
};
