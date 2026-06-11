import { useState, useEffect } from "react";
import {
  obtenerAutores,
  obtenerAutoresAreas,
  obtenerDatosBasicosAutores,
  obtenerDocumentos,
} from "../../api/services";
import { fixEncoding } from "../../utils/formatters";
import { config } from "../../config";
import { calculateTotalCitations, getAuthorId } from "../../utils/dataHelpers";

const useAutores = () => {
  const [autoresData, setAutoresData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [datosResponse, autoresResponse, documentosResponse, areasResponse] =
          await Promise.all([
            obtenerDatosBasicosAutores(),
            obtenerAutores(),
            obtenerDocumentos(),
            obtenerAutoresAreas().catch(() => ({ autores: [] })),
          ]);

        if (cancelled) return;

        const investigadoresData = datosResponse || [];
        const autores = autoresResponse.autores || [];
        const documentos = documentosResponse || {};
        const areasAutores = areasResponse?.autores || [];
        const areasMap = {};
        areasAutores.forEach((a) => {
          const id = getAuthorId(a);
          if (id && Array.isArray(a["subject-area"]) && a["subject-area"].length) {
            areasMap[id] = a["subject-area"];
          }
        });

        const autoresIdsEnScopus = new Set(
          autores.map((author) => getAuthorId(author)).filter(Boolean)
        );

        const investigadoresSinScopus = investigadoresData.filter(
          (inv) => !autoresIdsEnScopus.has(inv.autor_id)
        );

        const autoresConDatosCompletos = autores.map((author) => {
          const autorId = getAuthorId(author);
          let investigadorData = investigadoresData.find(
            (item) => item.autor_id === autorId
          );
          let totalCitas = calculateTotalCitations(documentos, autorId);
          let totalDocumentos = Array.isArray(documentos?.documentos?.[autorId])
            ? documentos.documentos[autorId].length
            : parseInt(author["document-count"] || 0, 10);

          if (autorId && config.DATA.AUTHOR_ID_MAPPING[autorId]) {
            investigadorData = investigadoresData.find(
              (item) => item.autor_id === config.DATA.AUTHOR_ID_MAPPING[autorId]
            );
          }

          const apellido = fixEncoding(author["preferred-name"]?.["surname"] || "");
          const nombre = fixEncoding(author["preferred-name"]?.["given-name"] || "");
          return {
            autorId: autorId || "",
            nombreCompleto: `${apellido}, ${nombre}`,
            rutaImagen: investigadorData ? investigadorData.ruta_imagen : "",
            gradosAcademicos: investigadorData
              ? investigadorData.grado_academico.join("<br>")
              : "",
            totalCitas: totalCitas,
            totalDocumentos: totalDocumentos,
            areasTematicas: investigadorData ? investigadorData.areas_tematicas : [],
            subjectArea: areasMap[autorId] || author["subject-area"] || (investigadorData?.areas_tematicas || []),
          };
        });

        const investigadoresAdicionales = investigadoresSinScopus.map((inv) => {
          const autorId = inv.autor_id;
          const totalCitas = calculateTotalCitations(documentos, autorId);
          let totalDocumentos = 0;

          if (Array.isArray(documentos?.documentos?.[autorId]) && documentos.documentos[autorId].length > 0) {
            totalDocumentos = documentos.documentos[autorId].length;
          }

          const nombreCorregido = fixEncoding(inv.nombre || "");
          const nombreParts = nombreCorregido ? nombreCorregido.split(" ") : [];
          const apellido = nombreParts.length > 0 ? nombreParts[nombreParts.length - 1] : "";
          const nombre = nombreParts.slice(0, -1).join(" ");

          return {
            autorId: autorId || "",
            nombreCompleto: `${apellido}, ${nombre}`,
            rutaImagen: inv.ruta_imagen || "",
            gradosAcademicos: inv.grado_academico
              ? inv.grado_academico.join("<br>")
              : "",
            totalCitas: totalCitas,
            totalDocumentos: totalDocumentos,
            areasTematicas: inv.areas_tematicas || [],
            subjectArea: [],
          };
        });

        const todosLosAutores = [...autoresConDatosCompletos, ...investigadoresAdicionales];

        if (!cancelled) {
          setAutoresData(todosLosAutores);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          // Usar el mensaje de error mejorado del interceptor si está disponible
          const errorMessage = error.userMessage || 
                              error.response?.data?.detail || 
                              error.message || 
                              config.MESSAGES.ERROR_LOAD_DATA;
          setError(errorMessage);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, []);

  return { autoresData, loading, error };
};

export default useAutores;
