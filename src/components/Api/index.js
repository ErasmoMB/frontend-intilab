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
      // eslint-disable-next-line no-loop-func
      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay *= 2; // Backoff exponencial
    }
  }
};

const obtenerAutores = async () => {
  try {
    const response = await retryRequest(() => api.get("/autores"));
    console.log("Respuesta completa de la API:", response.data);
    if (response.data && Array.isArray(response.data.autores)) {
      console.log("Número de autores obtenidos:", response.data.autores.length);
      return response.data.autores;
    } else {
      console.error("Los datos de autores no son un array:", response.data);
      throw new Error("Los datos de autores no tienen el formato esperado");
    }
  } catch (error) {
    console.error("Error al obtener datos de autores:", error);
    throw error;
  }
};

const obtenerDatosBasicosAutores = async () => {
  try {
    const response = await retryRequest(() => api.get("/datos"));
    console.log("Datos básicos de autores:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos básicos de autores:", error);
    throw error;
  }
};

const obtenerDocumentos = async () => {
  try {
    const response = await retryRequest(() => api.get("/documentos"));
    console.log("Documentos obtenidos:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al obtener documentos:", error);
    throw error;
  }
};

export { obtenerAutores, obtenerDatosBasicosAutores, obtenerDocumentos };
