import api from "../config/axios";
import retryRequest from "../utils/retryRequest";

export const obtenerInvestigadores = async () => {
  try {
    const response = await retryRequest(() =>
      api.get("/api/admin/investigadores")
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerInvestigador = async (id) => {
  try {
    const response = await retryRequest(() =>
      api.get(`/api/admin/investigadores/${id}`)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const crearInvestigador = async (formData) => {
  try {
    const response = await retryRequest(() =>
      api.post("/api/admin/investigadores", formData, {
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
      api.put(`/api/admin/investigadores/${id}`, formData, {
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
    const response = await retryRequest(() =>
      api.delete(`/api/admin/investigadores/${id}`)
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

