import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorMessage from "../../components/common/ErrorMessage";

describe("ErrorMessage", () => {
  test("no renderiza nada si no hay mensaje", () => {
    const { container } = render(<ErrorMessage />);
    expect(container.firstChild).toBeNull();
  });

  test("muestra el mensaje de error", () => {
    const errorMessage = "Error al cargar datos";
    render(<ErrorMessage message={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  test("muestra el botón de reintentar cuando se proporciona onRetry", () => {
    const onRetry = jest.fn();
    render(<ErrorMessage message="Error" onRetry={onRetry} />);
    const retryButton = screen.getByText("Reintentar");
    expect(retryButton).toBeInTheDocument();
  });

  test("llama a onRetry cuando se hace clic en el botón", async () => {
    const onRetry = jest.fn();
    render(<ErrorMessage message="Error" onRetry={onRetry} />);
    const retryButton = screen.getByText("Reintentar");
    await userEvent.click(retryButton);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

