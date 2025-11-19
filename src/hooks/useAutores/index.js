import { useState, useEffect } from "react";
import {
  obtenerAutores,
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
        const [datosResponse, autoresResponse, documentosResponse] =
          await Promise.all([
            obtenerDatosBasicosAutores(),
            obtenerAutores(),
            obtenerDocumentos(),
          ]);

        if (cancelled) return;

        const investigadoresData = datosResponse || [];
        const autores = autoresResponse.autores || [];
        const documentos = documentosResponse || {};

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
          let totalDocumentos = author["document-count"];

          if (autorId && config.DATA.AUTHOR_ID_MAPPING[autorId]) {
            investigadorData = investigadoresData.find(
              (item) => item.autor_id === config.DATA.AUTHOR_ID_MAPPING[autorId]
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
          setError(config.MESSAGES.ERROR_LOAD_DATA);
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
