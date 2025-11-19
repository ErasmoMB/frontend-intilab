import React, { memo, useEffect, useState } from "react";
import { obtenerDocumentos, obtenerAutoresUCH } from "../../../../api/services";
import { formatNumber } from "../../../../utils/formatters";
import { calculateTotalDocuments } from "../../../../utils/dataHelpers";

const Totals = memo(() => {
  const [loading, setLoading] = useState(true);
  const [totalDocumentos, setTotalDocumentos] = useState(0);
  const [totalAutores, setTotalAutores] = useState(0);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        setLoading(true);
        const [documentos, { total }] = await Promise.all([
          obtenerDocumentos(),
          obtenerAutoresUCH(),
        ]);
        
        const totalDocs = calculateTotalDocuments(documentos);
        setTotalDocumentos(totalDocs);
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

