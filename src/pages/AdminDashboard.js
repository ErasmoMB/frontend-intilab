import React, { useState, useEffect, useMemo, useCallback } from "react";
import { obtenerDocumentos, obtenerAutores, obtenerDatosBasicosAutores } from "../api/services";
import { formatNumber, fixEncoding } from "../utils/formatters";
import useInstitucion from "../hooks/useInstitucion";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import Charts from "../components/features/dashboard/Charts";
import { config as appConfig } from "../config";
import { calculateTotalDocuments, calculateAuthorCitations, getAuthorId, calculateTotalCitations } from "../utils/dataHelpers";

const AdminDashboard = () => {
  const { config: institucionConfig } = useInstitucion();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalInvestigadores: 0,
    totalDocumentos: 0,
    totalAutores: 0,
    totalCitas: 0,
    indiceH: 0,
  });
  const [topInvestigadores, setTopInvestigadores] = useState([]);
  const [chartType, setChartType] = useState("bar-chart");
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        datosResponse,
        autoresResponse,
        documentosResponse,
      ] = await Promise.all([
        obtenerDatosBasicosAutores(),
        obtenerAutores(),
        obtenerDocumentos(),
      ]);

      const investigadoresData = datosResponse || [];
      const autores = autoresResponse.autores || [];
      const documentos = documentosResponse || {};

      const autoresIdsEnScopus = new Set(
        autores.map((author) => author["dc:identifier"]?.split(":")[1]).filter(Boolean)
      );

      const investigadoresSinScopus = investigadoresData.filter(
        (inv) => !autoresIdsEnScopus.has(inv.autor_id)
      );

      let totalDocumentos = 0;
      let totalCitas = 0;
      const investigadoresConCitas = [];

      if (documentos?.documentos && autores) {
        totalDocumentos = calculateTotalDocuments(documentos);

        autores.forEach((author) => {
          const autorId = getAuthorId(author);
          const citasAutor = calculateAuthorCitations(author, documentos);
          totalCitas += citasAutor;

          const investigador = investigadoresData.find(
            (inv) => inv.autor_id === autorId
          );

          let totalDocumentosAutor = 0;
          if (Array.isArray(documentos?.documentos?.[autorId])) {
            totalDocumentosAutor = documentos.documentos[autorId].length;
          }

          const nombreFinal = investigador 
            ? fixEncoding(investigador.nombre)
            : `${author["preferred-name"]?.["surname"] || ""}, ${author["preferred-name"]?.["given-name"] || ""}`;

          investigadoresConCitas.push({
            ...investigador,
            autorId: autorId,
            nombre: nombreFinal,
            totalCitas: citasAutor,
            totalDocumentos: totalDocumentosAutor,
          });
        });

        investigadoresSinScopus.forEach((inv) => {
          const autorId = inv.autor_id;
          const citasAutor = calculateTotalCitations(documentos, autorId);
          totalCitas += citasAutor;
          let totalDocumentosAutor = 0;

          if (Array.isArray(documentos?.documentos?.[autorId]) && documentos.documentos[autorId].length > 0) {
            totalDocumentosAutor = documentos.documentos[autorId].length;
          }

          investigadoresConCitas.push({
            ...inv,
            autorId: autorId,
            nombre: fixEncoding(inv.nombre),
            totalCitas: citasAutor,
            totalDocumentos: totalDocumentosAutor,
          });
        });
      }

      const totalInvestigadores = investigadoresConCitas.length;
      const totalAutores = autores.length + investigadoresSinScopus.length;

      const sortedInvestigadores = investigadoresConCitas
        .sort((a, b) => b.totalCitas - a.totalCitas)
        .slice(0, appConfig.CHARTS.TOP_INVESTIGADORES);

      const citasOrdenadas = sortedInvestigadores
        .map((inv) => inv.totalCitas)
        .sort((a, b) => b - a);

      let indiceH = 0;
      for (let i = 0; i < citasOrdenadas.length; i++) {
        if (citasOrdenadas[i] >= i + 1) {
          indiceH = i + 1;
        } else {
          break;
        }
      }

      setStats({
        totalInvestigadores,
        totalDocumentos,
        totalAutores,
        totalCitas,
        indiceH,
      });

      setTopInvestigadores(sortedInvestigadores);
    } catch (err) {
      setError(appConfig.MESSAGES.ERROR_LOAD_STATS);
    } finally {
      setLoading(false);
    }
  };

  const nombreInstitucion = useMemo(() => institucionConfig?.nombre || "Institución", [institucionConfig?.nombre]);

  const handleChartTypeChange = useCallback((type) => {
    setChartType(type);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loading message="Cargando estadísticas..." />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mb-3 sm:mb-4 lg:mb-6">
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 sm:mb-2">Dashboard</h1>
        <p className="text-xs sm:text-sm lg:text-base text-slate-400 line-clamp-2 break-words">Vista general de estadísticas y métricas de {nombreInstitucion}</p>
      </div>

      {error && (
        <div className="mb-4 sm:mb-6">
          <ErrorMessage message={error} onRetry={cargarEstadisticas} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-3 sm:mb-4 lg:mb-6">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-slate-400 text-xs sm:text-sm mb-1">Total Investigadores</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-white break-words">{formatNumber(stats.totalInvestigadores)}</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-slate-400 text-xs sm:text-sm mb-1">Total Documentos</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-white break-words">{formatNumber(stats.totalDocumentos)}</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-slate-400 text-xs sm:text-sm mb-1">Total Citas</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-white break-words">{formatNumber(stats.totalCitas)}</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-slate-400 text-xs sm:text-sm mb-1">Índice H</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-white break-words">{formatNumber(stats.indiceH)}</p>
            </div>
            <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 lg:mb-6">
        <div className="lg:col-span-2 bg-slate-800 rounded-lg border border-slate-700 p-3 sm:p-4 md:p-6 w-full overflow-hidden">
          <div className="mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3">Gráficos y Estadísticas</h2>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleChartTypeChange("bar-chart")}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  chartType === "bar-chart"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Documentos
              </button>
              <button
                onClick={() => handleChartTypeChange("pie-chart")}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  chartType === "pie-chart"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Áreas
              </button>
              <button
                onClick={() => handleChartTypeChange("citations-chart")}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  chartType === "citations-chart"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                Citas
              </button>
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-2 sm:p-3 md:p-4 w-full overflow-hidden">
            <Charts chartType={chartType} />
          </div>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-3 sm:p-4 md:p-6 w-full">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3 md:mb-4">Top Investigadores</h2>
          <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] md:max-h-none overflow-y-auto">
            {topInvestigadores.length === 0 ? (
              <p className="text-slate-400 text-xs sm:text-sm">{appConfig.MESSAGES.NO_DATA_AVAILABLE}</p>
            ) : (
              topInvestigadores.map((inv, index) => (
                <div
                  key={inv._id || index}
                  className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-2.5 md:p-3 bg-slate-700/50 rounded-lg"
                >
                  <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-xs sm:text-sm truncate">{inv.nombre}</p>
                    <div className="flex items-center space-x-2 sm:space-x-3 mt-0.5 sm:mt-1">
                      <span className="text-slate-400 text-xs">
                        {formatNumber(inv.totalCitas)} citas
                      </span>
                      <span className="text-slate-400 text-xs">
                        {formatNumber(inv.totalDocumentos)} docs
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
