import { login, logout, getAuthToken, isAuthenticated } from "../../api/services/auth.service";
import { config } from "../../config";
import api from "../../api/config/axios";

jest.mock("../../api/config/axios", () => {
  const mockInstance = {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };
  return {
    __esModule: true,
    default: mockInstance,
  };
});



describe("auth.service", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("login", () => {
    test("inicia sesión exitosamente y guarda el token", async () => {
      const mockToken = "test-token-123";
      api.post.mockResolvedValue({ data: { token: mockToken } });

      const result = await login("admin", "password");

      expect(result.success).toBe(true);
      expect(result.token).toBe(mockToken);
      expect(localStorage.getItem(config.STORAGE.AUTH_TOKEN_KEY)).toBe(mockToken);
      expect(localStorage.getItem(config.STORAGE.AUTH_STATUS_KEY)).toBe("true");
    });

    test("maneja errores de autenticación", async () => {
      const errorMessage = "Credenciales inválidas";
      api.post.mockRejectedValue({
        response: { data: { detail: errorMessage } },
      });

      const result = await login("admin", "wrong-password");

      expect(result.success).toBe(false);
      expect(result.error).toBe(errorMessage);
    });
  });

  describe("logout", () => {
    test("limpia el localStorage", () => {
      localStorage.setItem(config.STORAGE.AUTH_TOKEN_KEY, "test-token");
      localStorage.setItem(config.STORAGE.AUTH_STATUS_KEY, "true");

      logout();

      expect(localStorage.getItem(config.STORAGE.AUTH_TOKEN_KEY)).toBeNull();
      expect(localStorage.getItem(config.STORAGE.AUTH_STATUS_KEY)).toBeNull();
    });
  });

  describe("getAuthToken", () => {
    test("retorna el token del localStorage", () => {
      const token = "test-token";
      localStorage.setItem(config.STORAGE.AUTH_TOKEN_KEY, token);
      expect(getAuthToken()).toBe(token);
    });

    test("retorna null si no hay token", () => {
      expect(getAuthToken()).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    test("retorna true cuando está autenticado", () => {
      localStorage.setItem(config.STORAGE.AUTH_STATUS_KEY, "true");
      expect(isAuthenticated()).toBe(true);
    });

    test("retorna false cuando no está autenticado", () => {
      expect(isAuthenticated()).toBe(false);
    });
  });
});

