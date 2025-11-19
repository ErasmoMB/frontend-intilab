import axios from "axios";
import { config } from "../../config";

const api = axios.create({
  baseURL: config.API.BASE_URL,
  timeout: config.API.TIMEOUT,
});

api.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(config.STORAGE.AUTH_TOKEN_KEY);
    if (token && !requestConfig.headers.Authorization) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(config.STORAGE.AUTH_TOKEN_KEY);
      localStorage.removeItem(config.STORAGE.AUTH_STATUS_KEY);
      window.location.href = config.ROUTES.LOGIN;
    }
    return Promise.reject(error);
  }
);

export default api;
