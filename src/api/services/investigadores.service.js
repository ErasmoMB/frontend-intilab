import api from "../config/axios";
import retryRequest from "../utils/retryRequest";
import { ENDPOINTS } from "../config/endpoints";

export const obtenerInvestigadores = async () => {
  try {
    const response = await retryRequest(() => api.get(ENDPOINTS.ADMIN.INVESTIGADORES));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerInvestigador = async (id) => {
  try {
    const response = await retryRequest(() => api.get(ENDPOINTS.ADMIN.INVESTIGADOR_BY_ID(id)));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const crearInvestigador = async (formData) => {
  try {
    const response = await retryRequest(() =>
      api.post(ENDPOINTS.ADMIN.INVESTIGADORES, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const actualizarInvestigador = async (id, formData) => {
  try {
    const response = await retryRequest(() =>
      api.put(ENDPOINTS.ADMIN.INVESTIGADOR_BY_ID(id), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const eliminarInvestigador = async (id) => {
  try {
    const response = await retryRequest(() => api.delete(ENDPOINTS.ADMIN.INVESTIGADOR_BY_ID(id)));
    return response.data;
  } catch (error) {
    throw error;
  }
};

