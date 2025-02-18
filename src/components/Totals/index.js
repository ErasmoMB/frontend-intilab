// components/Totals.js
import React, { useEffect, useState } from "react";
import { obtenerTotalDocumentos, obtenerTotalAutores } from "../Api";

function Totals() {
  const [totalDocumentos, setTotalDocumentos] = useState("Cargando...");
  const [totalAutores, setTotalAutores] = useState("Cargando...");

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const documentos = await obtenerTotalDocumentos();
        const { total } = await obtenerTotalAutores(); // Desestructuramos para obtener solo el total
        setTotalDocumentos(documentos);
        setTotalAutores(total); // Usamos solo el total de autores
      } catch (error) {
        console.error("Error al obtener totales:", error);
        setTotalDocumentos("Error al cargar documentos");
        setTotalAutores("Error al cargar autores");
      }
    };

    fetchTotals();
  }, []);

  return (
    <div id="totales">
      <div>
        <span>{totalDocumentos}</span>
        <p>Documentos</p>
      </div>
      <div>
        <span>{totalAutores}</span>
        <p>Autores</p>
      </div>
    </div>
  );
}

export default Totals;
