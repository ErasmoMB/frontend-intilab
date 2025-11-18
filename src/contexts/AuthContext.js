import React, { createContext, useState, useEffect } from "react";
import { login as authLogin, logout as authLogout, isAuthenticated, getAuthToken } from "../api/services/auth.service";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const result = await authLogin(username, password);
      if (result.success) {
        setAuthenticated(true);
        return { success: true };
      }
      return { success: false, error: "Credenciales inválidas" };
    } catch (error) {
      return { success: false, error: error.message || "Error al iniciar sesión" };
    }
  };

  const logout = () => {
    authLogout();
    setAuthenticated(false);
  };

  const value = {
    authenticated,
    loading,
    login,
    logout,
    token: getAuthToken(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

