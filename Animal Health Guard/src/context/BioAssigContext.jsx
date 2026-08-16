import { createContext, useState } from "react";

export const BioAssigContext = createContext();

export const BioAssigProvider = ({ children }) => {
  const BASE_URL = "http://localhost:5000/api/bio_assig";
  const [assignments, setAssignments] = useState([]);

  // Submit Assessment (Admin)
  const submitAssessment = async (riskScore, riskLevel, question_answer, farmType) => {
    try {
      let bodyData = {};
      if (typeof riskScore === "object" && riskScore !== null) {
        bodyData = riskScore;
      } else {
        bodyData = {
          riskScore,
          riskLevel,
          farmType,
          question_answer: Array.isArray(question_answer) ? question_answer : [],
        };
      }

      const response = await fetch(`${BASE_URL}/submit_assessment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message || "Failed to submit assessment");
        return false;
      }

      const created = json.assignment || json.assessment || json;
      setAssignments((prev) => [created, ...prev]);
      return created;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Get assessments of logged-in admin
  const getAssignmentOfAdmin = async (farmType) => {
    try {
      const url = farmType
        ? `${BASE_URL}/get_assignment_of_admin?farmType=${encodeURIComponent(farmType)}`
        : `${BASE_URL}/get_assignment_of_admin`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        setAssignments([]);
        return [];
      }

      const list = json.assignments || json.assignment || json.assessments || [];
      setAssignments(list);
      return list;
    } catch (error) {
      console.log(error);
      setAssignments([]);
      return [];
    }
  };

  // Get assessment by ID
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

  // Get all assessments (Public / User, with optional farmType filter)
  const getAllAssessments = async (farmType) => {
    try {
      const url = farmType
        ? `${BASE_URL}/get_all_assessments?farmType=${encodeURIComponent(farmType)}`
        : `${BASE_URL}/get_all_assessments`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        setAssignments([]);
        return [];
      }

      const list = json.assignments || json.assessments || [];
      setAssignments(list);
      return list;
    } catch (error) {
      console.log(error);
      setAssignments([]);
      return [];
    }
  };

  // Get assessments by farmType
  const getAssessmentsByFarmType = async (farmType) => {
    try {
      const response = await fetch(
        `${BASE_URL}/get_assessments_by_farmtype/${encodeURIComponent(farmType)}`,
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

      return json.assignments || json.assessments || [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // Delete assessment (Admin)
  const deleteAssignment = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/delete_assignment/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message || "Failed to delete assessment");
        return false;
      }

      setAssignments((prev) => prev.filter((item) => item._id !== id));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Update assessment (Admin)
  const updateAssignment = async (id, riskScore, riskLevel, question_answer, farmType) => {
    try {
      let bodyData = {};
      if (typeof riskScore === "object" && riskScore !== null) {
        bodyData = riskScore;
      } else {
        bodyData = {
          riskScore,
          riskLevel,
          farmType,
          question_answer: Array.isArray(question_answer) ? question_answer : undefined,
        };
      }

      const response = await fetch(`${BASE_URL}/update_assignment/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message || "Failed to update assessment");
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

  // Add question to assessment
  const addQuestionToAssessment = async (id, question, answer) => {
    try {
      const response = await fetch(`${BASE_URL}/add_question/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ question, answer }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message || "Failed to add question");
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

  // Delete question from assessment
  const deleteQuestionFromAssessment = async (id, questionId) => {
    try {
      const response = await fetch(`${BASE_URL}/delete_question/${id}/${questionId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message || "Failed to delete question");
        return false;
      }

      const updated = json.assignment || json.assessment || json;
      setAssignments((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
      return true;
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
        getAllAssessments,
        getAssessmentsByFarmType,
        deleteAssignment,
        updateAssignment,
        addQuestionToAssessment,
        deleteQuestionFromAssessment,
        assignments,
        setAssignments,
      }}
    >
      {children}
    </BioAssigContext.Provider>
  );
};

export default BioAssigProvider;
