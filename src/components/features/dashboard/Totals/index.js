import React, { memo, useEffect, useState } from "react";
import { obtenerTotalDocumentos, obtenerTotalAutores } from "../../../../api/services";
import { formatNumber } from "../../../../utils/formatters";

const Totals = memo(() => {
  const [loading, setLoading] = useState(true);
  const [totalDocumentos, setTotalDocumentos] = useState(0);
  const [totalAutores, setTotalAutores] = useState(0);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        setLoading(true);
        const [documentos, { total }] = await Promise.all([
          obtenerTotalDocumentos(),
          obtenerTotalAutores(),
        ]);
        setTotalDocumentos(documentos || 0);
        setTotalAutores(total || 0);
      } catch (error) {
        setTotalDocumentos(0);
        setTotalAutores(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  return (
    <div id="totales">
      <div>
        <span>{loading ? "..." : formatNumber(totalDocumentos)}</span>
        <p>Documentos</p>
      </div>
      <div>
        <span>{loading ? "..." : formatNumber(totalAutores)}</span>
        <p>Autores</p>
      </div>
    </div>
  );
});

Totals.displayName = "Totals";

export default Totals;

