import React from "react";

const Sidebar = ({ setChartType }) => {
  return (
    <div id="sidebar">
      <a
        href="#"
        id="bar-chart-sidebar"
        onClick={() => setChartType("bar-chart")}
      >
        <i className="fas fa-chart-bar"></i> Número de Documentos por Autor
      </a>
      <a
        href="#"
        id="pie-chart-sidebar"
        onClick={() => setChartType("pie-chart")}
      >
        <i className="fas fa-chart-pie"></i> Distribución de Áreas de
        Especialización
      </a>
      <a
        href="#"
        id="heatmap-sidebar"
        onClick={() => setChartType("citations-chart")}
      >
        <i className="fas fa-th"></i> Número de Citas por Autor
      </a>
      <a
        href="#"
        id="view-all-sidebar"
        onClick={() => setChartType("all-charts")}
      >
        <i className="fas fa-eye"></i> Ver Todo
      </a>
    </div>
  );
};

export default Sidebar;
