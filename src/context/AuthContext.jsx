import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../lib/api";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: true,
    user: null,
  });

  const loadUser = async () => {
    if (localStorage.token) {
      try {
        const res = await api.get("/auth/user");
        setAuthState({
          token: localStorage.getItem("token"),
          isAuthenticated: true,
          loading: false,
          user: res.data,
        });
      } catch (err) {
        localStorage.removeItem("token");
        setAuthState({
          token: null,
          isAuthenticated: false,
          loading: false,
          user: null,
        });
      }
    } else {
      setAuthState({
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (email, password) => {
    const body = { email, password };
    try {
      const res = await api.post("/auth/login", body);
      localStorage.setItem("token", res.data.token);
      await loadUser(); // Reload user data after getting token
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err.response.data);
      return {
        success: false,
        message: err.response.data.msg || "Login failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthState({
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
    });
  };

  const value = {
    ...authState,
    login,
    logout,
    loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!authState.loading && children}
    </AuthContext.Provider>
  );
};
