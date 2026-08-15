import { createContext, useState, useEffect } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const BASE_URL = "http://localhost:5000/api/admin";

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(0);
  const [adminDetail, setAdminDetail] = useState({
    name: "Admin",
    email: "admin@example.com",
    phone: "",
    location: ""
  });

  const checkAdminLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getadmin`, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        setIsAdminLoggedIn(1);
        const json = await response.json();
        setAdminDetail(json);
      } else {
        setIsAdminLoggedIn(0);
      }
    } catch (error) {
      setIsAdminLoggedIn(0);
      console.log(error);
    }
  };

  useEffect(() => {
    checkAdminLogin();
  }, []);

  // Admin Signup
  const adminSignup = async (name, email, password, phone, location) => {
    try {
      const response = await fetch(`${BASE_URL}/Signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          location,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsAdminLoggedIn(0);
        alert(json.message);
        return false;
      }

      setIsAdminLoggedIn(1);
      await getAdmin();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Admin Login
  const adminLogin = async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        setIsAdminLoggedIn(0);
        alert(json.message);
        return false;
      }

      setIsAdminLoggedIn(1);
      await getAdmin();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Get Admin Profile
  const getAdmin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/getadmin`, {
        method: "GET",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        setIsAdminLoggedIn(0);
        return;
      }

      setAdminDetail(json);
      setIsAdminLoggedIn(1);
    } catch (error) {
      setIsAdminLoggedIn(0);
      console.log(error);
    }
  };

  // Update Admin Profile
  const updateAdmin = async (name, phone, location) => {
    try {
      const response = await fetch(`${BASE_URL}/edit_admin`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          phone,
          location,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setAdminDetail(json.admin || json);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  // Admin Logout
  const adminLogout = async () => {
    try {
      const response = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });

      const json = await response.json();

      if (!response.ok) {
        alert(json.message);
        return false;
      }

      setAdminDetail({
        name: "Admin",
        email: "admin@example.com",
        phone: "",
        location: "",
      });

      setIsAdminLoggedIn(0);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  return (
    <AdminContext.Provider
      value={{
        adminSignup,
        adminLogin,
        adminLogout,
        getAdmin,
        updateAdmin,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        adminDetail,
        setAdminDetail,
        checkAdminLogin,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};