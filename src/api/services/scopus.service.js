import api from "../config/axios";
import { ENDPOINTS } from "../config/endpoints";

export const refreshAutores = async () => {
  const response = await api.get(ENDPOINTS.SCOPUS.AUTHORS, { timeout: 120000 });
  return response.data;
};

export const refreshAutoresUCH = async () => {
  const response = await api.get(ENDPOINTS.SCOPUS.AUTHORS_UCH, { timeout: 120000 });
  return response.data;
};

export const refreshDocuments = async (auId) => {
  const params = auId ? { au_id: auId } : {};
  const response = await api.get(ENDPOINTS.SCOPUS.DOCUMENTS, { params, timeout: 600000 });
  return response.data;
};

export const refreshDocumentsUCH = async () => {
  const response = await api.get(ENDPOINTS.SCOPUS.DOCUMENTS_UCH, { timeout: 120000 });
  return response.data;
};
