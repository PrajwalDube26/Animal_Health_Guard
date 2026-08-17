import { createContext, useState } from "react";

export const RecordContext = createContext();

export const RecordProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "/record";
  const [records, setrecords] = useState([]);

  // Create Record
  const createRecord = async (farmId, type, description, date) => {
    try {
      const response = await fetch(`${BASE_URL}/create_record/${farmId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          type,
          description,
          date,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setrecords((prev) => [...prev, json.record]);
      return json.record;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Get Records By Farm Id
  const getRecordsByFarmId = async (farmId) => {
    try {
      const response = await fetch(`${BASE_URL}/get_record_by_farmId/${farmId}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        setrecords([]);
        return [];
      }

      setrecords(json.records || []);
      return json.records;
    } catch (error) {
      console.log(error);
      setrecords([]);
      return [];
    }
  };

  // Get Record By Record Id
  const getRecordById = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/get_record_by_recordId/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        return null;
      }

      return json.record;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Update Record
  const updateRecord = async (farmId, id, type, description, date) => {
    try {
      const response = await fetch(
        `${BASE_URL}/update_record/${farmId}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            type,
            description,
            date,
          }),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setrecords((prev) =>
        prev.map((rec) => (rec._id === id ? json.record : rec))
      );
      return json.record;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Delete Record
  const deleteRecord = async (farmId, id) => {
    try {
      const response = await fetch(
        `${BASE_URL}/delete_record/${farmId}/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setrecords((prev) => prev.filter((record) => record._id !== id));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <RecordContext.Provider
      value={{
        createRecord,
        getRecordsByFarmId,
        getRecordById,
        updateRecord,
        deleteRecord,
        records,
        setrecords,
      }}
    >
      {children}
    </RecordContext.Provider>
  );
};
