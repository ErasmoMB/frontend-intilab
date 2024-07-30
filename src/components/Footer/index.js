import React from "react";
import uch from "../../assets/Logos/logo-uch.png";
import intilab from "../../assets/Logos/intilab.png";
import ehealth from "../../assets/Logos/ehealth.png";
import ciics from "../../assets/Logos/ciics.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-3 col-lg-4 logo-uch">
            <img
              src={uch}
              alt="Logo de la Universidad de Ciencias y Humanidades"
            />
          </div>
        </div>
        <div className="row">
          <div className="logo-laboratorio">
            <div className="col">
              <img src={intilab} alt="Logo de INTILAB" />
            </div>
            <div className="col">
              <img
                src={ehealth}
                alt="Logo de Grupo de Investigación E-health"
              />
            </div>
            <div className="col">
              <img
                src={ciics}
                alt="Logo del Centro de Investigación e Innovación en Ciencias de la Salud"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
