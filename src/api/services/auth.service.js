import api from "../config/axios";
import { ENDPOINTS } from "../config/endpoints";
import { config } from "../../config";

export const login = async (username, password) => {
  try {
    const response = await api.post(ENDPOINTS.AUTH.LOGIN, { username, password });
    const { token } = response.data;
    localStorage.setItem(config.STORAGE.AUTH_TOKEN_KEY, token);
    localStorage.setItem(config.STORAGE.AUTH_STATUS_KEY, "true");
    return { success: true, token };
  } catch (error) {
    const message = error.response?.data?.detail || error.message || "Error al iniciar sesión";
    return { success: false, error: message };
  }
};

export const logout = () => {
  localStorage.removeItem(config.STORAGE.AUTH_TOKEN_KEY);
  localStorage.removeItem(config.STORAGE.AUTH_STATUS_KEY);
};

export const getAuthToken = () => {
  return localStorage.getItem(config.STORAGE.AUTH_TOKEN_KEY);
};

export const isAuthenticated = () => {
  return localStorage.getItem(config.STORAGE.AUTH_STATUS_KEY) === "true";
};

