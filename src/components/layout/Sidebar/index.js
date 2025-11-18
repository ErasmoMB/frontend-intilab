import React, { memo, useCallback } from "react";

const Sidebar = memo(({ setChartType }) => {
  const handleChartTypeChange = useCallback(
    (type) => {
      setChartType(type);
    },
    [setChartType]
  );
  const handleClick = useCallback(
    (e, type) => {
      e.preventDefault();
      handleChartTypeChange(type);
    },
    [handleChartTypeChange]
  );

  return (
    <div id="sidebar">
      <button
        type="button"
        id="bar-chart-sidebar"
        onClick={(e) => handleClick(e, "bar-chart")}
      >
        <i className="fas fa-chart-bar"></i> Número de Documentos por Autor
      </button>
      <button
        type="button"
        id="pie-chart-sidebar"
        onClick={(e) => handleClick(e, "pie-chart")}
      >
        <i className="fas fa-chart-pie"></i> Distribución de Áreas de
        Especialización
      </button>
      <button
        type="button"
        id="heatmap-sidebar"
        onClick={(e) => handleClick(e, "citations-chart")}
      >
        <i className="fas fa-th"></i> Número de Citas por Autor
      </button>
      <button
        type="button"
        id="view-all-sidebar"
        onClick={(e) => handleClick(e, "all-charts")}
      >
        <i className="fas fa-eye"></i> Ver Todo
      </button>
    </div>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;

