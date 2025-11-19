const API_BASE = "/api";

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE}/auth/login`,
  },
  DATOS: {
    AUTHORS: `${API_BASE}/datos/authors`,
    AUTHORS_UCH: `${API_BASE}/datos/authors/uch`,
    DOCUMENTS: `${API_BASE}/datos/documents`,
    DOCUMENTS_UCH: `${API_BASE}/datos/documents/uch`,
    INVESTIGADORES: `${API_BASE}/datos/investigadores`,
  },
  ADMIN: {
    INVESTIGADORES: `${API_BASE}/admin/investigadores`,
    INVESTIGADOR_BY_ID: (id) => `${API_BASE}/admin/investigadores/${id}`,
    INSTITUCION: `${API_BASE}/admin/institucion`,
    CACHE: `${API_BASE}/admin/cache`,
  },
  PUBLIC: {
    INSTITUCION: `${API_BASE}/public/institucion`,
  },
  HEALTH: "/health",
};

