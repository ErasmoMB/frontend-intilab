import { config } from "../config";

describe("config", () => {
  test("tiene todas las propiedades requeridas", () => {
    expect(config).toHaveProperty("API");
    expect(config).toHaveProperty("STORAGE");
    expect(config).toHaveProperty("ROUTES");
    expect(config).toHaveProperty("VALIDATION");
    expect(config).toHaveProperty("UI");
  });

  test("API tiene BASE_URL y TIMEOUT", () => {
    expect(config.API).toHaveProperty("BASE_URL");
    expect(config.API).toHaveProperty("TIMEOUT");
    expect(typeof config.API.TIMEOUT).toBe("number");
  });

  test("STORAGE tiene las claves correctas", () => {
    expect(config.STORAGE).toHaveProperty("AUTH_TOKEN_KEY");
    expect(config.STORAGE).toHaveProperty("AUTH_STATUS_KEY");
  });

  test("ROUTES tiene todas las rutas definidas", () => {
    expect(config.ROUTES).toHaveProperty("HOME");
    expect(config.ROUTES).toHaveProperty("DASHBOARD");
    expect(config.ROUTES).toHaveProperty("LOGIN");
    expect(config.ROUTES).toHaveProperty("ADMIN");
    expect(config.ROUTES).toHaveProperty("ADMIN_DASHBOARD");
    expect(config.ROUTES).toHaveProperty("ADMIN_INVESTIGADORES");
    expect(config.ROUTES).toHaveProperty("ADMIN_CONFIGURACION");
  });

  test("VALIDATION tiene valores mínimos", () => {
    expect(config.VALIDATION).toHaveProperty("MIN_NOMBRE_LENGTH");
    expect(config.VALIDATION.MIN_NOMBRE_LENGTH).toBeGreaterThan(0);
  });

  test("UI tiene configuración de mensajes", () => {
    expect(config.UI).toHaveProperty("LOADING_MESSAGE");
    expect(config.UI).toHaveProperty("DEBOUNCE_DELAY");
  });
});

