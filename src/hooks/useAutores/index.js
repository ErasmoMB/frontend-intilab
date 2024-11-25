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

  // Datos manuales de citas y documentos
  const manualData = {
    "36659719000": { totalCitas: 698, totalDocumentos: 180 },
    "57207915215": { totalCitas: 514, totalDocumentos: 177 },
    "57016156500": { totalCitas: 802, totalDocumentos: 125 },
    "57209658640": { totalCitas: 51, totalDocumentos: 91 },
    "56741286500": { totalCitas: 329, totalDocumentos: 91 },
    "57210377414": { totalCitas: 198, totalDocumentos: 62 },
    "58562875900": { totalCitas: 18, totalDocumentos: 58 },
    "57215218631": { totalCitas: 465, totalDocumentos: 52 },
    "57205596738": { totalCitas: 251, totalDocumentos: 52 },
    "57205765369": { totalCitas: 15, totalDocumentos: 30 },
    "57225097710": { totalCitas: 29, totalDocumentos: 24 },
    "57215928001": { totalCitas: 75, totalDocumentos: 23 },
    "58127854500": { totalCitas: 11, totalDocumentos: 22 },
    "57204841219": { totalCitas: 29, totalDocumentos: 16 },
    "57223372908": { totalCitas: 3, totalDocumentos: 5 },
    "57211666738": { totalCitas: 12, totalDocumentos: 10 },
    "58077315000": { totalCitas: 8, totalDocumentos: 8 },
    "57930813500": { totalCitas: 1, totalDocumentos: 6 },
    "57364197600": { totalCitas: 2, totalDocumentos: 6 },
    "15750919900": { totalCitas: 87, totalDocumentos: 3 },
    "59164833900": { totalCitas: 0, totalDocumentos: 2 },
    "57203357446": { totalCitas: 17, totalDocumentos: 25 },
  };

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

            // Asignar manualmente los totales sin sumar
            let totalCitas = manualData[autorId]?.totalCitas || 0;
            let totalDocumentos = manualData[autorId]?.totalDocumentos || 0;

            // Verificar si el autor es el específico con ID "59164833900"
            if (autorId === "59164833900") {
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