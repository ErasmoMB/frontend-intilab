const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:8000";
  }
  return "https://backend-intilab.onrender.com";
};

export const config = {
  API: {
    BASE_URL: getApiBaseUrl(),
    TIMEOUT: parseInt(process.env.REACT_APP_API_TIMEOUT || "60000", 10),
  },
  STORAGE: {
    AUTH_TOKEN_KEY: "authToken",
    AUTH_STATUS_KEY: "isAuthenticated",
  },
  ROUTES: {
    HOME: "/",
    DASHBOARD: "/dashboard",
    LOGIN: "/login",
    ADMIN: "/admin",
    ADMIN_DASHBOARD: "/admin/dashboard",
    ADMIN_INVESTIGADORES: "/admin/investigadores",
    ADMIN_CONFIGURACION: "/admin/configuracion",
  },
  VALIDATION: {
    MIN_NOMBRE_LENGTH: 2,
    MIN_PASSWORD_LENGTH: 6,
  },
  UI: {
    LOADING_MESSAGE: "Cargando...",
    DEBOUNCE_DELAY: 300,
    CHART_RESIZE_DEBOUNCE: 250,
  },
  CHARTS: {
    MOBILE_BREAKPOINT: 768,
    DESKTOP_BREAKPOINT: 1024,
    MOBILE_HEIGHT: 400,
    DESKTOP_HEIGHT: 500,
    TOP_DOCUMENTS: 20,
    TOP_CITATIONS: 5,
    TOP_INVESTIGADORES: 10,
  },
  DATA: {
    EXCLUDED_AUTHOR_IDS: ["56902581400", "57200970000", "57201023602"],
    AUTHOR_ID_MAPPING: {
      "59164833900": "58886913200",
    },
  },
  MESSAGES: {
    ERROR_LOAD_DATA: "Error al cargar los datos. Por favor, intente de nuevo.",
    ERROR_LOAD_STATS: "Error al cargar las estadísticas",
    ERROR_LOAD_TOTALS: "Error al cargar totales",
    NO_DATA_AVAILABLE: "No hay datos disponibles",
  },
};

