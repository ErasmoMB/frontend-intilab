// AutorSlide.js
import React from "react";
import "./style.css";
import authorImage from "../../assets/Investigadores/alicia_alva.jpg";
import uch from "../../assets/Logos/logo-uch.png";
import intilab from "../../assets/Logos/intilab.png";
import ehealth from "../../assets/Logos/ehealth.png";
import ciics from "../../assets/Logos/ciics.png";

function AutorSlide({ autor, totalCitas, isVisible }) {
  return (
    <section
      className="author-banner"
      style={{ display: isVisible ? "flex" : "none" }}
    >
      <div className="slider">
        <div className="row">
          <div className="col-2 autor-img d-flex justify-content-center align-items-center">
            <img
              src={authorImage}
              alt="Imagen del autor"
              className="img-fluid"
            />
          </div>
          <div className="col-6 datos-autor">
            {/* Segunda columna para los datos */}
            <div className="author-research-output">
              <div className="author-name">
                <h1>
                  {autor["preferred-name"]["given-name"]}{" "}
                  {autor["preferred-name"]["surname"]}
                </h1>
                <h5>BACHILLER EN CIENCIAS CON MENCION EN MATEMATICAS</h5>
                <h5>
                  MAGISTER EN INFORMÁTICA BIOMÉDICA EN SALUD GLOBAL CON MENCIÓN
                  EN INFORMÁTICA EN SALUD
                </h5>
              </div>
              <div className="detalles-autor">
                <div className="author-citations">
                  <h1>N°{totalCitas}</h1>
                  <p>citaciones de {autor["document-count"]} documentos</p>
                </div>
                <div>
                  <h1>{autor["document-count"]}</h1>
                  <p>documentos</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4 uni-logos d-flex flex-column justify-content-center align-items-center">
            {/* Tercera columna para los logos */}
            <div className="row universidad">
              <img src={uch} alt="Imagen del autor" className="img-fluid" />
            </div>
            <div className="row laboratorios">
              <img src={intilab} alt="Imagen del autor" className="img-fluid" />
              <img src={ehealth} alt="Imagen del autor" className="img-fluid" />
              <img src={ciics} alt="Imagen del autor" className="img-fluid" />
            </div>
          </div>
        </div>
        <div className="row">
          {/* Segunda fila para otros gráficos */}
          <div className="col">{/* Aquí puedes insertar tus gráficos */}</div>
        </div>
      </div>
    </section>
  );
}

export default AutorSlide;
