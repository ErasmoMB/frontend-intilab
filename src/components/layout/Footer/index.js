import React, { memo } from "react";
import { Link } from "react-router-dom";
import uch from "../../../assets/Logos/logo-uch.png";
import intilab from "../../../assets/Logos/intilab.png";
import ehealth from "../../../assets/Logos/ehealth.png";
import ciics from "../../../assets/Logos/ciics.png";

const Footer = memo(() => {
  return (
    <>
      <div className="admin-access-mobile">
        <Link to="/dashboard" className="admin-access" aria-label="Ir al dashboard">
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" fill="currentColor"/>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#fff"/>
          </svg>
        </Link>
        <Link to="/login" className="admin-access" aria-label="Acceso administrador">
          <svg width="25" height="25" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11" fill="currentColor"/>
            <path d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm0 2c-3.315 0-6 2.239-6 5v1h12v-1c0-2.761-2.685-5-6-5z" fill="#fff"/>
          </svg>
        </Link>
      </div>
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="logo-laboratorio">
              <div className="col col-uch">
                <Link to="/dashboard">
                  <img
                    src={uch}
                    alt="Logo de la Universidad de Ciencias y Humanidades"
                    loading="lazy"
                  />
                </Link>
              </div>
              <div className="col-row-secondary">
                <div className="col">
                  <img src={intilab} alt="Logo de INTILAB" loading="lazy" />
                </div>
                <div className="col">
                  <img
                    src={ehealth}
                    alt="Logo de Grupo de Investigación E-health"
                    loading="lazy"
                  />
                </div>
                <div className="col">
                  <img
                    src={ciics}
                    alt="Logo del Centro de Investigación e Innovación en Ciencias de la Salud"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="admin-access-container">
                <Link to="/dashboard" className="admin-access" aria-label="Ir al dashboard">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="11" fill="currentColor"/>
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#fff"/>
                  </svg>
                </Link>
                <Link to="/login" className="admin-access" aria-label="Acceso administrador">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="11" fill="currentColor"/>
                    <path d="M12 12c2.209 0 4-1.791 4-4s-1.791-4-4-4-4 1.791-4 4 1.791 4 4 4zm0 2c-3.315 0-6 2.239-6 5v1h12v-1c0-2.761-2.685-5-6-5z" fill="#fff"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
});

Footer.displayName = "Footer";

export default Footer;

