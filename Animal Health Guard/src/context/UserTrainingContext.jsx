import { createContext, useState } from "react";

export const UserTrainingContext = createContext();

export const UserTrainingProvider = ({ children }) => {
  const BASE_URL = "http://localhost:5000/api/user_traning";
  const [userTrainings, setUserTrainings] = useState([]);

  // Enroll / Create User Training
  const createUserTraining = async (traningId) => {
    try {
      const response = await fetch(`${BASE_URL}/create_user_traning/${traningId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ traningId }),
      });

      const json = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          if (json.userTraning) {
            setUserTrainings((prev) => {
              const exists = prev.some(
                (item) => (item.traningId?._id || item.traningId) === traningId
              );
              return exists ? prev : [...prev, json.userTraning];
            });
          }
        }
        return { success: false, message: json.message, status: response.status };
      }

      const created = json.userTraning || json.userTraining || json;
      setUserTrainings((prev) => [...prev, created]);
      return { success: true, userTraining: created };
    } catch (error) {
      console.log(error);
      return { success: false, message: error.message };
    }
  };

  // Get User Training assignments for logged-in user
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

  // Unenroll / Delete specific User Training by training ID
  const unenrollUserTraining = async (traningId) => {
    try {
      const response = await fetch(`${BASE_URL}/delete_user_traning/${traningId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        return false;
      }

      setUserTrainings((prev) =>
        prev.filter(
          (item) =>
            (item.traningId?._id || item.traningId) !== traningId &&
            item._id !== traningId
        )
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Helper method to check if user is enrolled in a training module
  const isTrainingEnrolled = (traningId) => {
    return userTrainings.some(
      (item) => (item.traningId?._id || item.traningId) === traningId
    );
  };

  return (
    <UserTrainingContext.Provider
      value={{
        createUserTraining,
        createUserTraning: createUserTraining,
        getUserTrainingByUserId,
        getUserTraningByUserId: getUserTrainingByUserId,
        getUserTrainingByTrainingId,
        deleteUserTrainingByUserId,
        unenrollUserTraining,
        deleteUserTrainingByTrainingId: unenrollUserTraining,
        isTrainingEnrolled,
        isTraningEnrolled: isTrainingEnrolled,
        userTrainings,
        setUserTrainings,
      }}
    >
      {children}
    </UserTrainingContext.Provider>
  );
};

export default UserTrainingProvider;
