import React from "react";
import { render, screen } from "@testing-library/react";
import Loading from "../../components/common/Loading";

describe("Loading", () => {
  test("renderiza el componente de carga", () => {
    render(<Loading />);
    const spinner = screen.getByLabelText("Cargando");
    expect(spinner).toBeInTheDocument();
  });

  test("muestra el mensaje por defecto", () => {
    render(<Loading />);
    expect(screen.getByText("Cargando...")).toBeInTheDocument();
  });

  test("muestra un mensaje personalizado", () => {
    const customMessage = "Cargando datos...";
    render(<Loading message={customMessage} />);
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
});

