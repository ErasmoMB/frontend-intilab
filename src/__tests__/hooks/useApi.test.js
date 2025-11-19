import { renderHook, act } from "@testing-library/react";
import useApi from "../../hooks/useApi";

describe("useApi", () => {
  test("inicializa con loading en false y sin error", () => {
    const { result } = renderHook(() => useApi());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test("ejecuta una llamada API exitosa", async () => {
    const { result } = renderHook(() => useApi());
    const mockApiCall = jest.fn().mockResolvedValue({ data: "success" });

    await act(async () => {
      const response = await result.current.execute(mockApiCall);
      expect(response.success).toBe(true);
      expect(response.data).toEqual({ data: "success" });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test("maneja errores en llamadas API", async () => {
    const { result } = renderHook(() => useApi());
    const mockApiCall = jest.fn().mockRejectedValue(new Error("API Error"));

    await act(async () => {
      const response = await result.current.execute(mockApiCall);
      expect(response.success).toBe(false);
      expect(response.error).toBe("API Error");
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe("API Error");
  });

  test("resetError limpia el error", async () => {
    const { result } = renderHook(() => useApi());
    const mockApiCall = jest.fn().mockRejectedValue(new Error("API Error"));

    await act(async () => {
      await result.current.execute(mockApiCall);
    });

    expect(result.current.error).toBe("API Error");

    act(() => {
      result.current.resetError();
    });

    expect(result.current.error).toBe(null);
  });
});

