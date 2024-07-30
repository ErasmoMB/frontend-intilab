import axios from "axios";

const baseUrl = "http://127.0.0.1:5000"; // Base URL de tu backend

const obtenerDatosBasicosAutores = async () => {
  try {
    const response = await axios.get(`${baseUrl}/datos`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener datos básicos de autores:", error);
    throw error;
  }
};

const obtenerAutores = async () => {
  try {
    const response = await axios.get(`${baseUrl}/autores`);
    console.log("Número de autores obtenidos:", response.data.autores.length);
    return response.data.autores;
  } catch (error) {
    console.error("Error al obtener datos de autores:", error);
    throw error;
  }
};

const obtenerDocumentos = async () => {
  try {
    const response = await axios.get(`${baseUrl}/documentos`);
    return response.data.documentos;
  } catch (error) {
    console.error("Error al obtener datos de documentos:", error);
    throw error;
  }
};

export { obtenerDatosBasicosAutores, obtenerAutores, obtenerDocumentos };
