import React, { memo } from "react";
import { Link } from "react-router-dom";
import useInstitucion from "../../../hooks/useInstitucion";
import Loading from "../../common/Loading";

import logoUCH from "../../../assets/Logos/logo-uch.png";
import logoCIICS from "../../../assets/Logos/ciics.png";
import logoEHealth from "../../../assets/Logos/ehealth.png";
import logoIntiLab from "../../../assets/Logos/intilab.png";

const LOGOS_DEPARTAMENTOS = {
  ciics: logoCIICS,
  "e-health": logoEHealth,
  "ehealth": logoEHealth,
  "inti-lab": logoIntiLab,
  "intilab": logoIntiLab,
};

const Footer = memo(() => {
  const { config, loading } = useInstitucion();

  if (loading) {
    return (
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="logo-laboratorio">
              <Loading message="" />
            </div>
          </div>
        </div>
      </footer>
    );
  }

  const logoPrincipal = config?.logo_principal_url || logoUCH;
  const departamentos = config?.departamentos || {};
  const nombreInstitucion = config?.nombre || "Universidad de Ciencias y Humanidades";

  const departamentosArray = Object.entries(departamentos).map(([clave, dept]) => ({
    clave,
    ...dept,
    logoLocal: LOGOS_DEPARTAMENTOS[clave.toLowerCase()] || null,
  }));

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
                    src={logoPrincipal}
                    alt={`Logo de ${nombreInstitucion}`}
                    loading="lazy"
                    onError={(e) => {
                      if (e.target.src !== logoUCH) {
                        e.target.src = logoUCH;
                      } else {
                        e.target.style.display = "none";
                      }
                    }}
                  />
                </Link>
              </div>
              
              {departamentosArray.length > 0 && (
                <div className="col-row-secondary">
                  {departamentosArray.map((dept) => {
                    const logoSrc = dept.logo_url || dept.logoLocal;
                    
                    return (
                      <div key={dept.clave} className="col">
                        {logoSrc ? (
                          <img
                            src={logoSrc}
                            alt={`Logo de ${dept.nombre}`}
                            loading="lazy"
                            onError={(e) => {
                              if (dept.logo_url && dept.logoLocal && e.target.src !== dept.logoLocal) {
                                e.target.src = dept.logoLocal;
                              } else {
                                e.target.style.display = "none";
                              }
                            }}
                          />
                        ) : (
                          <span className="text-slate-600 text-sm">{dept.nombre}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
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
