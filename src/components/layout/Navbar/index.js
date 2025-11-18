import React, { memo, useCallback } from "react";

const Navbar = memo(({ setChartType }) => {
  const handleChartTypeChange = useCallback(
    (type) => {
      setChartType(type);
    },
    [setChartType]
  );
  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <a className="navbar-brand" href="/">
        Universidad de Ciencias y Humanidades
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i className="fas fa-bars"></i>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              id="show-bar-chart"
              onClick={() => handleChartTypeChange("bar-chart")}
            >
              <i className="fas fa-chart-bar"></i> Número de Documentos por
              Autor
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              id="show-pie-chart"
              onClick={() => handleChartTypeChange("pie-chart")}
            >
              <i className="fas fa-chart-pie"></i> Distribución de Áreas de
              Especialización
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              id="show-citations-chart"
              onClick={() => handleChartTypeChange("citations-chart")}
            >
              <i className="fas fa-th"></i> Número de Citas por Autor
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link"
              href="#"
              id="show-all-charts"
              onClick={() => handleChartTypeChange("all-charts")}
            >
              <i className="fas fa-eye"></i> Ver Todo
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;

