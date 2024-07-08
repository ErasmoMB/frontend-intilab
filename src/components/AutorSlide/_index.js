import React, { useState, useEffect } from "react";
import "./style.css";
import uch from "../../assets/Logos/logo-uch.png";
import intilab from "../../assets/Logos/intilab.png";
import ehealth from "../../assets/Logos/ehealth.png";
import ciics from "../../assets/Logos/ciics.png";

function AutorSlide({ autor, totalCitas, isVisible }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsEntering(true);
      setTimeout(() => setIsAnimating(true), 50); // Inicia la animación de entrada después de 50ms
      const timeoutId = setTimeout(() => {
        setIsEntering(false);
        setIsAnimating(false);
      }, 1000); // Duración de la animación (1s)
      return () => clearTimeout(timeoutId);
    }
  }, [autor, isVisible]); // Este efecto se dispara cada vez que `autor` o `isVisible` cambian

  return (
    <section
      className="author-banner"
      style={{ display: isVisible ? "flex" : "none" }}
    >
      <div className={`slider ${isAnimating ? "slide-animate" : ""}`}>
        <div className={`row ${isEntering ? "slide-enter" : ""}`}>
          <div className="col-12 col-sm-4 col-md-3 col-lg-2 autor-img d-flex justify-content-center align-items-center">
            <img
              src={autor.image}
              alt={`Imagen de ${autor.nombre}`}
              className="img-fluid"
            />
          </div>
          <div className="col-12 col-sm-8 col-md-6 col-lg-6 datos-autor">
            <div className="author-research-output">
              <div className="author-name">
                <h1>{autor.nombre}</h1>
                <h5>{autor.descripcion}</h5>
                <p>{autor.bachiller}</p>
              </div>
              <div className="detalles-autor">
                <div className="author-citations">
                  <h1>N°{autor.citas.numero}</h1>
                  <p>citaciones de {autor.citas.documentos} documentos</p>
                </div>
                <div>
                  <h1>{autor.citas.documentos}</h1>
                  <p>documentos</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3 col-lg-4 uni-logos d-flex flex-column justify-content-center align-items-center">
            <div className="row universidad">
              <img src={uch} alt="Logo UCH" className="img-fluid" />
            </div>
            <div className="row laboratorios">
              <img src={intilab} alt="Logo INTILAB" className="img-fluid" />
              <img src={ehealth} alt="Logo eHealth" className="img-fluid" />
              <img src={ciics} alt="Logo CIICS" className="img-fluid" />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">{/* Aquí puedes insertar tus gráficos */}</div>
        </div>
      </div>
    </section>
  );
}

export default AutorSlide;
