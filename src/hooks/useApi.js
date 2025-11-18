import { useState, useCallback } from "react";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (apiCall) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      return { success: true, data: result };
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail ||
        err.message ||
        "Ocurrió un error inesperado";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const resetError = useCallback(() => {
    setError(null);
  }, []);

  return { loading, error, execute, resetError };
};

export default useApi;

