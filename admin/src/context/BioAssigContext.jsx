import { createContext, useState } from "react";

export const BioAssigContext = createContext();

export const BioAssigProvider = ({ children }) => {
  const BASE_URL = "http://localhost:5000/api/bio_assig";
  const [assignments, setAssignments] = useState([]);

  // Submit assessment (Admin)
  const submitAssessment = async (title, description, category, questions) => {
    try {
      const response = await fetch(`${BASE_URL}/submit_assessment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          category,
          questions,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setAssignments((prev) => [...prev, json.assignment || json.assessment || json]);
      return json;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Get assignments of logged-in admin
  const getAssignmentOfAdmin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get_assignment_of_admin`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        setAssignments([]);
        return [];
      }

      const list = json.assignment || json.assignments || json.assessments || [];
      setAssignments(list);
      return list;
    } catch (error) {
      console.log(error);
      setAssignments([]);
      return [];
    }
  };

  // Get assignment by ID
  const getAssignmentById = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/assignment_by_id/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        return null;
      }

      return json.assignment || json.assessment || json;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Delete assignment (Admin)
  const deleteAssignment = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/delete_assignment/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setAssignments((prev) => prev.filter((item) => item._id !== id));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Update assignment (Admin)
  const updateAssignment = async (id, title, description, category) => {
    try {
      const response = await fetch(`${BASE_URL}/update_assignment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          title,
          description,
          category,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      const updated = json.assignment || json.assessment || json;
      setAssignments((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
      return updated;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <BioAssigContext.Provider
      value={{
        submitAssessment,
        getAssignmentOfAdmin,
        getAssignmentById,
        deleteAssignment,
        updateAssignment,
        assignments,
        setAssignments,
      }}
    >
      {children}
    </BioAssigContext.Provider>
  );
};
