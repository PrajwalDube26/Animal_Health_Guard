import { createContext, useState } from "react";

export const FarmAssignmentContext = createContext();

export const FarmAssignmentProvider = ({ children }) => {
  const BASE_URL = "http://localhost:5000/api/Farm_Assignment";
  const [farmAssignments, setFarmAssignments] = useState([]);

  // Create Farm-Assignment Relation
  const createFarmAssignment = async (farmId, assignmentId) => {
    try {
      const response = await fetch(
        `${BASE_URL}/create_farm_assignment/${farmId}/${assignmentId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
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

      const list = json.farmAssignments || json.assignments || json.data || [];
      setFarmAssignments(list);
      return list;
    } catch (error) {
      console.log(error);
      setFarmAssignments([]);
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

      return json.farmAssignments || json.assignments || json.data || [];
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

      setFarmAssignments((prev) => prev.filter((item) => item.farmId !== farmId));
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
        prev.filter((item) => item.assignmentId !== assignmentId)
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
          (item) => !(item.farmId === farmId && item.assignmentId === assignmentId)
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
