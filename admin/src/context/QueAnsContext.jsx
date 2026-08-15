import { createContext, useState } from "react";

export const QueAnsContext = createContext();

export const QueAnsProvider = ({ children }) => {
  const BASE_URL = "http://localhost:5000/api/que_ans";
  const [questionsAnswers, setQuestionsAnswers] = useState([]);

  // Create question/answer for an assessment
  const createQuestionsAnswer = async (assignmentId, question, options, correctAnswer, category) => {
    try {
      const response = await fetch(`${BASE_URL}/createQuestionsAnswer/${assignmentId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          question,
          options,
          correctAnswer,
          category,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setQuestionsAnswers((prev) => [...prev, json.questionAnswer || json.qa || json]);
      return json;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Get question/answers by assignment ID
  const getQuestionsAnswerByAssignId = async (assignmentId) => {
    try {
      const response = await fetch(`${BASE_URL}/getQuestionsAnswerByAssignId/${assignmentId}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        setQuestionsAnswers([]);
        return [];
      }

      const list = json.questionAnswers || json.questions || json.data || [];
      setQuestionsAnswers(list);
      return list;
    } catch (error) {
      console.log(error);
      setQuestionsAnswers([]);
      return [];
    }
  };

  // Get single question/answer by ID
  const getQuestionsAnswerByID = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/getQuestionsAnswerByID/${id}`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        console.log(json.message);
        return null;
      }

      return json.questionAnswer || json.qa || json;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // Delete question/answer
  const deleteQuestionsAnswer = async (assignmentId, id) => {
    try {
      const response = await fetch(`${BASE_URL}/deleteQuestionsAnswer/${assignmentId}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setQuestionsAnswers((prev) => prev.filter((item) => item._id !== id));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Update question/answer
  const updateQuestionsAnswer = async (assignmentId, id, question, options, correctAnswer, category) => {
    try {
      const response = await fetch(`${BASE_URL}/updateQuestionsAnswer/${assignmentId}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          question,
          options,
          correctAnswer,
          category,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      const updated = json.questionAnswer || json.qa || json;
      setQuestionsAnswers((prev) =>
        prev.map((item) => (item._id === id ? updated : item))
      );
      return updated;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <QueAnsContext.Provider
      value={{
        createQuestionsAnswer,
        getQuestionsAnswerByAssignId,
        getQuestionsAnswerByID,
        deleteQuestionsAnswer,
        updateQuestionsAnswer,
        questionsAnswers,
        setQuestionsAnswers,
      }}
    >
      {children}
    </QueAnsContext.Provider>
  );
};
