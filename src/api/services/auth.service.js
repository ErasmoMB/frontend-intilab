import api from "../config/axios";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin";

export const login = async (username, password) => {
  try {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = process.env.REACT_APP_SECRET_KEY || "dev-secret-key-change-in-production";
      localStorage.setItem("authToken", token);
      localStorage.setItem("isAuthenticated", "true");
      return { success: true, token };
    } else {
      throw new Error("Credenciales inválidas");
    }
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("isAuthenticated");
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const isAuthenticated = () => {
  return localStorage.getItem("isAuthenticated") === "true";
};

