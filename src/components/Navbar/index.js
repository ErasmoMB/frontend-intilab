// components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-custom">
      <Link className="navbar-brand" to="/">
        Universidad de Ciencias y Humanidades
      </Link>
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
            <Link className="nav-link" to="/bar-chart">
              <i className="fas fa-chart-bar"></i> Número de Documentos por
              Autor
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/pie-chart">
              <i className="fas fa-chart-pie"></i> Distribución de Áreas de
              Especialización
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/citations">
              <i className="fas fa-th"></i> Número de Citas por Autor
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/ver-todo">
              <i className="fas fa-eye"></i> Ver Todo
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
