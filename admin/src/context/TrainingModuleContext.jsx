import { createContext, useState } from "react";

export const TrainingModuleContext = createContext();

export const TrainingModuleProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "/traning_module";
  const [trainingModules, setTrainingModules] = useState([]);

  // Create training module (Admin)
  const createTrainingModule = async (title, description, content, category, language) => {
    try {
      const response = await fetch(`${BASE_URL}/createTraningModule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          content,
          category,
          language: language || "English",
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      const created = json.TraningModule || json.trainingModule || json;
      setTrainingModules((prev) => [...prev, created]);
      return created;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Get training modules created by logged-in Admin
  const getTrainingModuleByAdminId = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getTraningModuleByAdminID`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        setTrainingModules([]);
        return [];
      }

      const list = json.TraningModule || json.trainingModules || [];
      setTrainingModules(list);
      return list;
    } catch (error) {
      console.log(error);
      setTrainingModules([]);
      return [];
    }
  };

  // Get training module by ID
  const getTrainingModuleById = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/getTraningModuleByID/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        return null;
      }

      return json.TraningModule || json.trainingModule || json;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Get all training modules (Public)
  const getAllTrainingModules = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getAllTraningModule`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        setTrainingModules([]);
        return [];
      }

      const list = json.TraningModule || json.trainingModules || [];
      setTrainingModules(list);
      return list;
    } catch (error) {
      console.log(error);
      setTrainingModules([]);
      return [];
    }
  };

  // Delete training module (Admin)
  const deleteTrainingModule = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/deleteTraningModule/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setTrainingModules((prev) => prev.filter((item) => item._id !== id));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Update training module (Admin)
  const updateTrainingModule = async (id, title, description, content, category, language) => {
    try {
      const response = await fetch(`${BASE_URL}/updateTraningModule/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          content,
          category,
          language: language || "English",
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      const updated = json.TraningModule || json.trainingModule || json;
      setTrainingModules((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
      return updated;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <TrainingModuleContext.Provider
      value={{
        createTrainingModule,
        getTrainingModuleByAdminId,
        getTraningModuleByAdminID: getTrainingModuleByAdminId,
        getTrainingModuleById,
        getAllTrainingModules,
        deleteTrainingModule,
        updateTrainingModule,
        trainingModules,
        setTrainingModules,
      }}
    >
      {children}
    </TrainingModuleContext.Provider>
  );
};

export default TrainingModuleProvider;
