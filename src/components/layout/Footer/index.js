import React, { memo } from "react";
import { Link } from "react-router-dom";
import uch from "../../../assets/Logos/logo-uch.png";
import intilab from "../../../assets/Logos/intilab.png";
import ehealth from "../../../assets/Logos/ehealth.png";
import ciics from "../../../assets/Logos/ciics.png";

const Footer = memo(() => {
  return (
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
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = "Footer";

export default Footer;

