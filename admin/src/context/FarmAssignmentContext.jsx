import { createContext, useState } from "react";

export const FarmAssignmentContext = createContext();

export const FarmAssignmentProvider = ({ children }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL + "/Farm_Assignment";
  const [farmAssignments, setFarmAssignments] = useState([]);

  // Create Farm-Assignment Relation / Response
  const createFarmAssignment = async (farmId, assignmentId, farmer_answer, farmer_score_percentage, admin_answer) => {
    try {
      let bodyData = {};
      if (typeof farmer_answer === "object" && !Array.isArray(farmer_answer) && farmer_answer !== null) {
        bodyData = farmer_answer;
      } else {
        bodyData = {
          farmer_answer,
          admin_answer,
          farmer_score_percentage,
        };
      }

      const response = await fetch(
        `${BASE_URL}/create_farm_assignment/${farmId}/${assignmentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(bodyData),
        }
      );

      const json = await response.json();

      if (!response.ok) {
        alert(json.message || "Failed to create farm assignment");
        return false;
      }

      const created = json.farmAssignment || json;
      setFarmAssignments((prev) => [...prev, created]);
      return created;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Update Farm Assignment Response
  const updateFarmAssignment = async (id, farmer_answer, farmer_score_percentage, admin_answer) => {
    try {
      let bodyData = {};
      if (typeof farmer_answer === "object" && !Array.isArray(farmer_answer) && farmer_answer !== null) {
        bodyData = farmer_answer;
      } else {
        bodyData = {
          farmer_answer,
          admin_answer,
          farmer_score_percentage,
        };
      }

      const response = await fetch(`${BASE_URL}/update_farm_assignment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message || "Failed to update farm assignment");
        return false;
      }

      const updated = json.farmAssignment || json;
      setFarmAssignments((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
      return updated;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Get All Farm Assignments
  const getAllFarmAssignments = async () => {
    try {
      const response = await fetch(`${BASE_URL}/get_all_farm_assignments`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        return [];
      }

      const list = json.farmAssignments || [];
      setFarmAssignments(list);
      return list;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // Get Farm Assignment by ID
  const getFarmAssignmentById = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/get_farm_assignment_by_id/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        return null;
      }

      return json.farmAssignment || json;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Get Farm Assignments by Farm ID
  const getFarmAssignmentByFarmId = async (farmId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/get_farm_assignment_by_farmId/${farmId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        setFarmAssignments([]);
        return [];
      }

      const list = json.farmAssignment || json.farmAssignments || json.assignments || [];
      setFarmAssignments(list);
      return list;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // Get Farm Assignments by Assignment ID
  const getFarmAssignmentByAssignmentId = async (assignmentId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/get_farm_assignment_by_assignmentId/${assignmentId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        return [];
      }

      return json.farmAssignment || json.farmAssignments || json.assignments || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // Delete Farm Assignments by Farm ID
  const deleteFarmAssignmentByFarmId = async (farmId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/delete_farm_assignment_by_farmId/${farmId}`,
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

      setFarmAssignments((prev) => prev.filter((item) => item.farmId?._id !== farmId && item.farmId !== farmId));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Delete Farm Assignments by Assignment ID
  const deleteFarmAssignmentByAssignmentId = async (assignmentId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/delete_farm_assignment_by_assignmentId/${assignmentId}`,
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

      setFarmAssignments((prev) =>
        prev.filter((item) => item.assignment_id?._id !== assignmentId && item.assignment_id !== assignmentId)
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Delete specific Farm-Assignment pair
  const deleteFarmAssignment = async (farmId, assignmentId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/delete_farm_assignment/${farmId}/${assignmentId}`,
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

      setFarmAssignments((prev) =>
        prev.filter(
          (item) => !((item.farmId?._id === farmId || item.farmId === farmId) && (item.assignment_id?._id === assignmentId || item.assignment_id === assignmentId))
        )
      );
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <FarmAssignmentContext.Provider
      value={{
        createFarmAssignment,
        updateFarmAssignment,
        getAllFarmAssignments,
        getFarmAssignmentById,
        getFarmAssignmentByFarmId,
        getFarmAssignmentByAssignmentId,
        deleteFarmAssignmentByFarmId,
        deleteFarmAssignmentByAssignmentId,
        deleteFarmAssignment,
        farmAssignments,
        setFarmAssignments,
      }}
    >
      {children}
    </FarmAssignmentContext.Provider>
  );
};

export default FarmAssignmentProvider;
