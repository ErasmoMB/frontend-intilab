import axios from 'axios';

export async function getAutores() {
  const response = await axios.get('http://127.0.0.1:5000/autores');
  console.log(response.data);  
  return response.data;
}

export async function getDocumentos() {
  const response = await axios.get('http://127.0.0.1:5000/documentos');
  console.log(response.data);  
  return response.data;
}

export async function getDocumentosAfiliados() {
  const response = await axios.get('http://127.0.0.1:5000/documentos_afiliados');
  console.log(response.data);  
  return response.data;
}

export async function getCitacionesTotales(autorId) {
  // Obtén los documentos del autor
  const documentos = await getDocumentosDeAutor(autorId);
  // Suma las citas de todos los documentos
  let totalCitaciones = 0;
  for (let documento of documentos) {
    // Comprueba si el campo 'citedby-count' existe y es un número
    if (documento['citedby-count'] && !isNaN(documento['citedby-count'])) {
      totalCitaciones += parseInt(documento['citedby-count'], 10);
    }
  }

  return totalCitaciones;
}

async function getDocumentosDeAutor(autorId) {
  const response = await axios.get(`http://127.0.0.1:5000/documentos?dc:identifier=${autorId}`);
  console.log(response.data);  
  return response.data.documentos;
}