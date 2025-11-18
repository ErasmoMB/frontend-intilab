import { useState, useEffect } from "react";
import {
  obtenerAutores,
  obtenerDatosBasicosAutores,
  obtenerDocumentos,
} from "../../api/services";

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

        const investigadoresData = datosResponse || [];
        const autores = autoresResponse.autores || [];
        const documentos = documentosResponse.documentos || {};

        const autoresConDatosCompletos = await Promise.all(
          autores.map(async (author) => {
            const autorId = author["dc:identifier"]?.split(":")[1];
            let investigadorData = investigadoresData.find(
              (item) => item.autor_id === autorId
            );
            let totalCitas = 0;
            let totalDocumentos = author["document-count"];

            if (Array.isArray(documentos[autorId]) && documentos[autorId].length > 0) {
              totalCitas = documentos[autorId].reduce((sum, documento) => {
                const citas = parseInt(documento["citedby-count"]) || 0;
                return sum + citas;
              }, 0);
            }

            if (autorId === "59164833900") {
              investigadorData = investigadoresData.find(
                (item) => item.autor_id === "58886913200"
              );
            }

            return {
              autorId: autorId || "",
              nombreCompleto: `${
                author["preferred-name"]?.["surname"] || ""
              }, ${author["preferred-name"]?.["given-name"] || ""}`,
              rutaImagen: investigadorData ? investigadorData.ruta_imagen : "",
              gradosAcademicos: investigadorData
                ? investigadorData.grado_academico.join("<br>")
                : "",
              totalCitas: totalCitas,
              totalDocumentos: totalDocumentos,
              areasTematicas: investigadorData ? investigadorData.areas_tematicas : [],
              subjectArea: author["subject-area"],
            };
          })
        );

        setAutoresData(autoresConDatosCompletos);
        setLoading(false);
      } catch (error) {
        setError("Error al cargar los datos. Por favor, intente de nuevo.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { autoresData, loading, error };
};

export default useAutores;
