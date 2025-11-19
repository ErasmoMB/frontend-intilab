import api from "../config/axios";
import retryRequest from "../utils/retryRequest";
import { ENDPOINTS } from "../config/endpoints";

export const obtenerConfiguracion = async () => {
  try {
    const response = await retryRequest(() => api.get(ENDPOINTS.ADMIN.INSTITUCION));
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.detail || error.message || "Error al obtener la configuración de la institución";
    return { success: false, error: message };
  }
};

export const actualizarConfiguracion = async (data) => {
  try {
    const response = await retryRequest(() => api.put(ENDPOINTS.ADMIN.INSTITUCION, data));
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.detail || error.message || "Error al actualizar la configuración de la institución";
    return { success: false, error: message };
  }
};

export const inicializarConfiguracion = async () => {
  try {
    const response = await retryRequest(() => api.post(`${ENDPOINTS.ADMIN.INSTITUCION}/inicializar`));
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.detail || error.message || "Error al inicializar la configuración de la institución";
    return { success: false, error: message };
  }
};

export const subirLogo = async (file, tipo) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tipo", tipo);
    const response = await retryRequest(() =>
      api.post(`${ENDPOINTS.ADMIN.INSTITUCION}/upload-logo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
    return { success: true, data: response.data };
  } catch (error) {
    const message = error.response?.data?.detail || error.message || "Error al subir el logo";
    return { success: false, error: message };
  }
};
