import React, { memo } from "react";
import { Link } from "react-router-dom";
import useInstitucion from "../../../hooks/useInstitucion";

const Navbar = memo(({ onMenuToggle, isMobile }) => {
  const { config } = useInstitucion();
  const nombreInstitucion = config?.nombre || "Universidad de Ciencias y Humanidades";

  return (
    <header className="dashboard-header">
      <nav className="dashboard-navbar">
        <div className="navbar-content">
          {isMobile && (
            <button
              className="navbar-menu-btn"
              onClick={onMenuToggle}
              aria-label="Abrir menú"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          )}
          <h1 className="navbar-title">{nombreInstitucion}</h1>
          <Link to="/" className="navbar-back-btn" aria-label="Volver al slider">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
      </nav>
    </header>
  );
});

Navbar.displayName = "Navbar";

export default Navbar;
