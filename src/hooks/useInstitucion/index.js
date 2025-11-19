import { useState, useEffect } from "react";
import api from "../../api/config/axios";
import retryRequest from "../../api/utils/retryRequest";

const useInstitucion = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await retryRequest(() =>
          api.get("/api/public/institucion")
        );
        setConfig(response.data);
      } catch (err) {
        // Usar el mensaje de error mejorado del interceptor si está disponible
        const errorMessage = err.userMessage || 
                            err.response?.data?.detail || 
                            err.message || 
                            "Error al cargar la configuración de la institución";
        setError(errorMessage);
        // Usar valores por defecto si falla la carga
        setConfig({
          nombre: "Universidad de Ciencias y Humanidades",
          logo_principal_url: "",
          fondo_slider_url: "",
          descripcion: "",
          departamentos: {},
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  return { config, loading, error };
};

export default useInstitucion;

