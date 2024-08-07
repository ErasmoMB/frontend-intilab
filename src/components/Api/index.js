import axios from "axios";

const baseUrl = "http://127.0.0.1:5000";

const api = axios.create({
  baseURL: baseUrl,
  timeout: 30000, // 30 segundos
});

const retryRequest = async (apiCall, retries = 3, initialDelay = 1000) => {
  let currentDelay = initialDelay;
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= 2; // Backoff exponencial
    }
  }
};

const obtenerAutores = async () => {
  try {
    const response = await retryRequest(() => api.get("/autores"));
    return response.data.autores;
  } catch (error) {
    throw error;
  }
};

const obtenerDatosBasicosAutores = async () => {
  try {
    const response = await retryRequest(() => api.get("/datos"));
    return response.data;
  } catch (error) {
    throw error;
  }
};

const obtenerDocumentos = async () => {
  try {
    const response = await retryRequest(() => api.get("/documentos"));
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener total de documentos
const obtenerTotalDocumentos = async () => {
  try {
    const response = await retryRequest(() => api.get("/uch"));
    return response.data.informacion_afiliaciones?.["search-results"]?.[
      "opensearch:totalResults"
    ];
  } catch (error) {
    throw error;
  }
};

// Obtener total de autores
const obtenerTotalAutores = async () => {
  try {
    const response = await retryRequest(() => api.get("/autores-uch"));
    return response.data.total_autores_uch; // Asegúrate de que esta propiedad exista en la respuesta
  } catch (error) {
    throw error;
  }
};

export {
  obtenerAutores,
  obtenerDatosBasicosAutores,
  obtenerDocumentos,
  obtenerTotalDocumentos,
  obtenerTotalAutores,
};
