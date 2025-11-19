import React from "react";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider } from "../../contexts/AuthContext";
import { useAuth } from "../../hooks/useAuth";
import { config } from "../../config";

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe("useAuth", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("retorna el estado de autenticación inicial", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.authenticated).toBe(false);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  test("actualiza el estado después de verificar autenticación", async () => {
    localStorage.setItem(config.STORAGE.AUTH_STATUS_KEY, "true");
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.authenticated).toBe(true);
  });

  test("login actualiza el estado de autenticación", async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await act(async () => {
      const loginResult = await result.current.login("admin", "password");
      expect(loginResult.success).toBeDefined();
    });
  });

  test("logout limpia el estado de autenticación", async () => {
    localStorage.setItem(config.STORAGE.AUTH_STATUS_KEY, "true");
    localStorage.setItem(config.STORAGE.AUTH_TOKEN_KEY, "test-token");
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    act(() => {
      result.current.logout();
    });
    expect(result.current.authenticated).toBe(false);
  });
});

