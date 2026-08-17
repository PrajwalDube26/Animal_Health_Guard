import { createContext, useState } from "react";

export const FarmContext = createContext();

export const FarmProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "/farm";
  const [farms, setfarms] = useState([]);

  // Create Farm
  const createFarm = async (
    farmName,
    farmType,
    location,
    size,
    numberOfAnimals
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/create_farm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          farmName,
          farmType,
          location,
          size,
          numberOfAnimals,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.error || json.message);
        return false;
      }

      setfarms((prevFarms) => [...prevFarms, json.farm]);
      return json.farm;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Get All Farms of Logged In User
  const getUserFarms = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get_farm_by_Userid`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        setfarms([]);
        return [];
      }

      setfarms(json.farms || []);
      return json.farms;
    } catch (error) {
      console.log(error);
      setfarms([]);
      return [];
    }
  };

  // Get Farm By Id
  const getFarmById = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/get_farm_by_id/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        return null;
      }

      setfarms([json.farm]);
      return json.farm;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Update Farm
  const updateFarm = async (
    id,
    farmName,
    farmType,
    location,
    size,
    numberOfAnimals
  ) => {
    try {
      const response = await fetch(`${BASE_URL}/update_farm/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          farmName,
          farmType,
          location,
          size,
          numberOfAnimals,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setfarms((prevFarms) =>
        prevFarms.map((farm) => (farm._id === id ? json.farm : farm))
      );
      return json.farm;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Delete Farm
  const deleteFarm = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/delete_farm/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setfarms((prevFarms) => prevFarms.filter((farm) => farm._id !== id));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <FarmContext.Provider
      value={{
        createFarm,
        getUserFarms,
        getFarmById,
        updateFarm,
        deleteFarm,
        farms,
        setfarms,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};
