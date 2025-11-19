import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../../routes/ProtectedRoute";
import { AuthProvider } from "../../contexts/AuthContext";
import { config } from "../../config";

const TestComponent = () => <div>Contenido protegido</div>;

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("muestra loading cuando está cargando", async () => {
    render(
      <AuthProvider>
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      </AuthProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
    }, { timeout: 1000 });
  });

  test("redirige a login cuando no está autenticado", async () => {
    localStorage.setItem(config.STORAGE.AUTH_STATUS_KEY, "false");
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={["/admin"]}>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </MemoryRouter>
      </AuthProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
    });
  });

  test("muestra el contenido cuando está autenticado", async () => {
    localStorage.setItem(config.STORAGE.AUTH_STATUS_KEY, "true");
    localStorage.setItem(config.STORAGE.AUTH_TOKEN_KEY, "test-token");
    render(
      <AuthProvider>
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      </AuthProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
    });
  });
});

