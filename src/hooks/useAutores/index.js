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

        const autoresData = datosResponse || [];
        const autores = autoresResponse || [];
        const documentos = documentosResponse || {};

        const autoresConDatosCompletos = autores.map((author) => {
          const autorId = author["dc:identifier"]?.split(":")[1];
          const autorData = autoresData.find(
            (item) => item.autor_id === autorId
          );
          let totalCitas = 0;
          let totalDocumentos = author["document-count"];

          if (documentos[autorId]) {
            totalCitas = documentos[autorId].reduce(
              (sum, documento) =>
                sum + parseInt(documento["citedby-count"]) || 0,
              0
            );
          }

          return {
            autorId: autorId || "",
            nombreCompleto: `${author["preferred-name"]?.["surname"] || ""}, ${
              author["preferred-name"]?.["given-name"] || ""
            }`,
            rutaImagen: autorData ? autorData.ruta_imagen : "",
            gradosAcademicos: autorData
              ? autorData.grado_academico.join("<br>")
              : "",
            totalCitas: totalCitas,
            totalDocumentos: totalDocumentos,
            areasTematicas: autorData ? autorData.areas_tematicas : [],
            subjectArea: author["subject-area"],
          };
        });

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
