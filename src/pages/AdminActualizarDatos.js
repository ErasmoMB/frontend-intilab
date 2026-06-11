import React, { useState, useRef, useCallback } from "react";
import { refreshAutores, refreshDocuments } from "../api/services";

const DELAY_BETWEEN_AUTHORS = 3000;
const RETRY_DELAY = 5000;
const MAX_ZERO_RETRIES = 3;

const STATUS = {
  PENDING: "pending",
  LOADING: "loading",
  DONE: "done",
  ERROR: "error",
};

const statusConfig = {
  [STATUS.PENDING]: { label: "Pendiente", cls: "text-slate-400" },
  [STATUS.LOADING]: { label: "Consultando...", cls: "text-blue-400" },
  [STATUS.DONE]: { label: "Completado", cls: "text-green-400" },
  [STATUS.ERROR]: { label: "Error", cls: "text-red-400" },
};

const numberCell = (val) => (
  <td className="p-3 text-center text-white font-medium">{val}</td>
);

const AdminActualizarDatos = () => {
  const [rows, setRows] = useState([]);
  const [ejecutando, setEjecutando] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, completados: 0, errores: 0 });
  const abortRef = useRef(false);

  const sleep = useCallback((ms) => new Promise((r) => setTimeout(r, ms)), []);

  const actualizarFila = useCallback((idx, cambios) => {
    setRows((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, ...cambios } : r))
    );
  }, []);

  const procesarAutor = useCallback(async (row, idx) => {
    actualizarFila(idx, { status: STATUS.LOADING, errorMsg: null });

    for (let intento = 0; intento <= MAX_ZERO_RETRIES; intento++) {
      try {
        if (idx > 0 && intento === 0) await sleep(DELAY_BETWEEN_AUTHORS);
        if (intento > 0) await sleep(RETRY_DELAY);
        if (abortRef.current) return;

        const docsData = await refreshDocuments(row.id);
        const docsArr = docsData?.documentos?.[row.id] || [];

        if (docsArr.length === 0 && intento < MAX_ZERO_RETRIES) {
          continue;
        }

        let totalCitas = 0;
        docsArr.forEach((d) => {
          totalCitas += parseInt(d["citedby-count"] || 0, 10);
        });

        actualizarFila(idx, {
          status: STATUS.DONE,
          documentos: docsArr.length,
          citas: totalCitas,
        });
        setStats((prev) => ({ ...prev, completados: prev.completados + 1 }));
        return;
      } catch (err) {
        if (intento < MAX_ZERO_RETRIES) continue;
        actualizarFila(idx, {
          status: STATUS.ERROR,
          errorMsg: err.response?.data?.detail || err.message,
        });
        setStats((prev) => ({ ...prev, errores: prev.errores + 1 }));
        return;
      }
    }
  }, [actualizarFila, sleep]);

  const ejecutar = useCallback(async () => {
    setEjecutando(true);
    setError(null);
    abortRef.current = false;
    setStats({ total: 0, completados: 0, errores: 0 });

    try {
      const autoresData = await refreshAutores();
      const autores = autoresData?.autores || [];
      if (!autores.length) {
        setError("No se encontraron autores en Scopus");
        return;
      }

      const initialRows = autores.map((a, i) => ({
        idx: i,
        id: (a["dc:identifier"] || "").replace("AUTHOR_ID:", ""),
        surname: a["preferred-name"]?.surname || "",
        givenName: a["preferred-name"]?.["given-name"] || "",
        status: STATUS.PENDING,
        documentos: 0,
        citas: 0,
        errorMsg: null,
      }));
      setRows(initialRows);
      setStats((prev) => ({ ...prev, total: initialRows.length }));

      for (let i = 0; i < initialRows.length; i++) {
        if (abortRef.current) break;
        await procesarAutor(initialRows[i], i);
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setEjecutando(false);
    }
  }, [procesarAutor]);

  const retryAuthor = useCallback(async (idx) => {
    const row = rows[idx];
    if (!row) return;
    setStats((prev) => ({ ...prev, errores: Math.max(0, prev.errores - 1) }));
    await sleep(RETRY_DELAY);
    if (abortRef.current) return;
    await procesarAutor(row, idx);
  }, [rows, sleep, procesarAutor]);

  const statusBadge = (s) => {
    const cfg = statusConfig[s] || statusConfig[STATUS.PENDING];
    return <span className={`text-sm font-medium ${cfg.cls}`}>{cfg.label}</span>;
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Actualizar Datos Scopus
        </h1>
        <p className="text-slate-400">
          Actualiza los datos de investigadores desde Scopus. Cada autor se
          consulta secuencialmente con {DELAY_BETWEEN_AUTHORS / 1000}s de
          intervalo. Los resultados se guardan en el caché del servidor.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="mb-4 flex items-center gap-4">
        <button
          onClick={ejecutar}
          disabled={ejecutando}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
        >
          {ejecutando ? "Ejecutando..." : "Ejecutar"}
        </button>
        {ejecutando && (
          <span className="text-blue-400 text-sm animate-pulse">
            Procesando autores...
          </span>
        )}
      </div>

      {stats.total > 0 && (
        <div className="mb-4 flex gap-6 text-sm">
          <span className="text-slate-400">
            Total:{" "}
            <span className="text-white font-medium">{stats.total}</span>
          </span>
          <span className="text-green-400">
            Completados:{" "}
            <span className="font-medium">{stats.completados}</span>
          </span>
          <span className="text-red-400">
            Errores:{" "}
            <span className="font-medium">{stats.errores}</span>
          </span>
        </div>
      )}

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/50">
              <th className="text-left p-3 text-slate-400 font-medium">#</th>
              <th className="text-left p-3 text-slate-400 font-medium">
                Apellidos
              </th>
              <th className="text-left p-3 text-slate-400 font-medium">
                Nombres
              </th>
              <th className="text-center p-3 text-slate-400 font-medium">
                Documentos
              </th>
              <th className="text-center p-3 text-slate-400 font-medium">
                Citas
              </th>
              <th className="text-center p-3 text-slate-400 font-medium">
                Estado
              </th>
              <th className="text-center p-3 text-slate-400 font-medium">
                Acción
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-6 text-center text-slate-500"
                >
                  Presione "Ejecutar" para comenzar la actualización
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr
                  key={row.id || row.idx}
                  className="border-b border-slate-700 hover:bg-slate-700/30"
                >
                  <td className="p-3 text-slate-300">{row.idx + 1}</td>
                  <td className="p-3 text-white">{row.surname}</td>
                  <td className="p-3 text-white">{row.givenName}</td>
                  {numberCell(row.documentos)}
                  {numberCell(row.citas)}
                  <td className="p-3 text-center">
                    {statusBadge(row.status)}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => retryAuthor(row.idx)}
                      disabled={ejecutando}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white text-xs font-medium rounded transition-colors"
                    >
                      Reintentar
                    </button>
                  </td>
                </tr>
              ))
            )}
            {rows.length > 0 && (
              <tr className="bg-slate-700/50 font-medium">
                <td colSpan={3} className="p-3 text-white">
                  TOTAL
                </td>
                <td className="p-3 text-center text-white">
                  {rows.reduce((s, r) => s + r.documentos, 0)}
                </td>
                <td className="p-3 text-center text-white">
                  {rows.reduce((s, r) => s + r.citas, 0)}
                </td>
                <td colSpan={2} className="p-3 text-center text-slate-400 text-xs">
                  {stats.completados} completados
                  {stats.errores > 0 ? `, ${stats.errores} errores` : ""}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminActualizarDatos;
