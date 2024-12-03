import { useState, useEffect } from "react";
import {
  obtenerAutores,
  obtenerDatosBasicosAutores,
  obtenerDocumentos,
} from "../../components/Api";

const useAutores = () => {
  const [autoresData, setAutoresData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [datosResponse, autoresResponse, documentosResponse] =
          await Promise.all([
            obtenerDatosBasicosAutores(),
            obtenerAutores(),
            obtenerDocumentos(),
          ]);

        console.log("Datos básicos de autores:", datosResponse);
        console.log("Autores:", autoresResponse);
        console.log("Documentos:", documentosResponse);

        const autoresData = datosResponse || [];
        const autores = autoresResponse.autores || [];
        const documentos = documentosResponse.documentos || {};

        const autoresConDatosCompletos = await Promise.all(
          autores.map(async (author) => {
            const autorId = author["dc:identifier"]?.split(":")[1];
            let autorData = autoresData.find(
              (item) => item.autor_id === autorId
            );
            let totalCitas = 0;
            let totalDocumentos = author["document-count"];
        
            // Verifica si documentos[autorId] es un array y no está vacío
            if (Array.isArray(documentos[autorId]) && documentos[autorId].length > 0) {
              totalCitas = documentos[autorId].reduce((sum, documento) => {
                const citas = parseInt(documento["citedby-count"]) || 0;
                return sum + citas;
              }, 0);
            } else {
              console.error("No se encontraron documentos para el autor:", autorId);
            }
        
            // Verificar si el autor es el específico con ID "59164833900"
            if (autorId === "59164833900") {
              // Obtener datos adicionales para este autor usando el ID "58886913200"
              autorData = autoresData.find(
                (item) => item.autor_id === "58886913200"
              );
            }
        
            return {
              autorId: autorId || "",
              nombreCompleto: `${
                author["preferred-name"]?.["surname"] || ""
              }, ${author["preferred-name"]?.["given-name"] || ""}`,
              rutaImagen: autorData ? autorData.ruta_imagen : "",
              gradosAcademicos: autorData
                ? autorData.grado_academico.join("<br>")
                : "",
              totalCitas: totalCitas,
              totalDocumentos: totalDocumentos,
              areasTematicas: autorData ? autorData.areas_tematicas : [],
              subjectArea: author["subject-area"],
            };
          })
        );

        console.log("Autores con datos completos:", autoresConDatosCompletos);

        setAutoresData(autoresConDatosCompletos);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("Error al cargar los datos. Por favor, intente de nuevo.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { autoresData, loading, error };
};

export default useAutores;
