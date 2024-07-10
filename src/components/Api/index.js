import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

export async function getAutores() {
  const response = await axios.get(`${BASE_URL}/autores`);
  console.log(response.data);
  return response.data;
}

export async function getDocumentos() {
  const response = await axios.get(`${BASE_URL}/documentos`);
  console.log(response.data);
  return response.data;
}

export async function getCitacionesTotales(autorId) {
  const documentos = await getDocumentosDeAutor(autorId);
  let totalCitaciones = 0;
  for (let documento of documentos) {
    if (documento["citedby-count"] && !isNaN(documento["citedby-count"])) {
      totalCitaciones += parseInt(documento["citedby-count"], 10);
    }
  }
  return totalCitaciones;
}

async function getDocumentosDeAutor(autorId) {
  const response = await axios.get(
    `${BASE_URL}/documentos?dc:identifier=${autorId}`
  );
  console.log(response.data);
  return response.data.documentos;
}

export async function getDatos() {
  const url = `${BASE_URL}/datos`;
  try {
    const response = await axios.get(url);
    return response.data.map((autor) => ({
      id: autor.autor_id,
      nombre: autor.nombre,
      gradosAcademicos: autor.grado_academico,
      rutaImagen: autor.ruta_imagen,
    }));
  } catch (error) {
    console.error("Error al obtener los autores:", error);
    return [];
  }
}
