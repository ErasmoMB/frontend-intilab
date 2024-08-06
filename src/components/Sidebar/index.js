// components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div id="sidebar">
      <Link to="/dashboard" id="bar-chart-sidebar">
        <i className="fas fa-chart-bar"></i> Número de Documentos por Autor
      </Link>
      <Link to="/distribucion" id="pie-chart-sidebar">
        <i className="fas fa-chart-pie"></i> Distribución de Áreas de
        Especialización
      </Link>
      <Link to="/citas" id="citations-sidebar">
        <i className="fas fa-th"></i> Número de Citas por Autor
      </Link>
      <Link to="/ver-todo" id="view-all-sidebar">
        <i className="fas fa-eye"></i> Ver Todo
      </Link>
    </div>
  );
}

export default Sidebar;
