import api from "../config/axios";

export const login = async (username, password) => {
  try {
    const response = await api.post("/api/auth/login", { username, password });
    const { token } = response.data;
    localStorage.setItem("authToken", token);
    localStorage.setItem("isAuthenticated", "true");
    return { success: true, token };
  } catch (error) {
    const message = error.response?.data?.detail || error.message || "Error al iniciar sesión";
    return { success: false, error: message };
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("isAuthenticated");
};

export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

export const isAuthenticated = () => localStorage.getItem("isAuthenticated") === "true";

