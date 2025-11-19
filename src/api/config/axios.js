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
    
    // Mejorar mensajes de error para CORS y problemas de conexión
    if (!error.response) {
      if (error.message?.includes('CORS') || error.code === 'ERR_NETWORK') {
        error.userMessage = "Error de conexión: El servidor no está respondiendo o hay un problema de CORS. Verifica que el backend esté en ejecución.";
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        error.userMessage = "Tiempo de espera agotado: El servidor está tardando demasiado en responder.";
      } else {
        error.userMessage = "Error de conexión: No se pudo conectar con el servidor.";
      }
    } else if (error.response.status === 503) {
      error.userMessage = "Servicio no disponible: El backend está temporalmente fuera de servicio. Por favor, intenta más tarde.";
    } else if (error.response.status >= 500) {
      error.userMessage = "Error del servidor: El servidor está experimentando problemas. Por favor, intenta más tarde.";
    }
    
    return Promise.reject(error);
  }
);

export default api;
