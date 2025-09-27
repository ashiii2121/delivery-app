import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

// Create the context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Set default authorization header for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_ENDPOINTS.AUTH}/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      // Store in state
      setToken(token);
      setUser(user);

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Set default authorization header for axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout function
  const logout = () => {
    // Clear state
    setUser(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Remove default authorization header
    delete axios.defaults.headers.common["Authorization"];
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // Check if user is authenticated
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAdmin,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
