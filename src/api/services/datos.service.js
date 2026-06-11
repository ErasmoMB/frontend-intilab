import api from "../config/axios";
import retryRequest from "../utils/retryRequest";
import { ENDPOINTS } from "../config/endpoints";

export const obtenerAutores = async () => {
  try {
    const response = await retryRequest(() => api.get(ENDPOINTS.DATOS.AUTHORS));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerAutoresAreas = async () => {
  try {
    const response = await retryRequest(() => api.get(ENDPOINTS.DATOS.AUTHORS_AREAS));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerAutoresUCH = async () => {
  try {
    const response = await retryRequest(() => api.get(ENDPOINTS.DATOS.AUTHORS_UCH));
    const datos = response.data.autores_uch;
    return {
      total: datos?.total_autores_uch || 0,
      autores: datos?.autores || [],
    };
  } catch (error) {
    throw error;
  }
};

export const obtenerDatosBasicosAutores = async () => {
  try {
    const response = await retryRequest(() => api.get("/api/datos"));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerDocumentos = async () => {
  try {
    const response = await retryRequest(() => api.get(ENDPOINTS.DATOS.DOCUMENTS));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const obtenerTotalDocumentos = async () => {
  try {
    const response = await retryRequest(() => api.get(ENDPOINTS.DATOS.DOCUMENTS_UCH));
    const informacion = response.data.informacion_uch;
    return informacion?.["search-results"]?.["opensearch:totalResults"] || 0;
  } catch (error) {
    throw error;
  }
};

export const obtenerTotalAutores = async () => {
  try {
    const response = await retryRequest(() => api.get(ENDPOINTS.DATOS.AUTHORS_UCH));
    const datos = response.data.autores_uch;
    return {
      total: datos?.total_autores_uch || 0,
      data: datos?.autores || [],
    };
  } catch (error) {
    throw error;
  }
};

