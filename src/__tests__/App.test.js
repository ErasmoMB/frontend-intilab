import React from "react";
import { render } from "@testing-library/react";
import App from "../App";
import { AuthProvider } from "../contexts/AuthContext";

const renderWithProviders = (ui) => {
  return render(<AuthProvider>{ui}</AuthProvider>);
};

describe("App", () => {
  test("renderiza la aplicación sin errores", () => {
    renderWithProviders(<App />);
    const appElement = document.querySelector(".App");
    expect(appElement).toBeInTheDocument();
  });
});

