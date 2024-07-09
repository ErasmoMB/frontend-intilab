// AutorSlide.js
import React from "react";
import "./style.css";
import authorImage from "../../assets/Investigadores/Victor_Romero.jpg";
import uch from "../../assets/Logos/logo-uch.png";
import intilab from "../../assets/Logos/intilab.png";
import ehealth from "../../assets/Logos/ehealth.png";
import ciics from "../../assets/Logos/ciics.png";

function AutorSlide({ autor, totalCitas, isVisible }) {
  const [isAnimating, setIsAnimating] = React.useState(false);

  React.useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timeoutId = setTimeout(() => setIsAnimating(false), 1000); // Duración de la animación (1s)
      return () => clearTimeout(timeoutId);
    }
  }, [autor, isVisible]); // Este efecto se dispara cada vez que `autor` o `isVisible` cambian

  return (
    <section
      className="author-banner"
      style={{ display: isVisible ? "flex" : "none" }}
    >
      <div className={`slider ${isAnimating ? "slide-animate" : ""}`}>
        <div className="row">
          <div className="col-12 col-sm-4 col-md-3 col-lg-2 autor-img d-flex justify-content-center align-items-center">
            <img
              src={authorImage}
              alt="Imagen del autor"
              className="img-fluid"
            />
          </div>
          <div className="col-12 col-sm-8 col-md-6 col-lg-6 datos-autor">
            <div className="author-research-output">
              <div className="author-name">
                <h1>
                  {autor["preferred-name"]["given-name"]}{" "}
                  {autor["preferred-name"]["surname"]}
                </h1>
                <h5>
                  MAGÍSTER EN EL ÁREA DE SISTEMA DE MISILES Y COSMONÁUTICA
                </h5>
                <p>
                  BACHILLER EN INGENIERÍA ELECTRÓNICA CON MENCIÓN EN
                  TELECOMUNICACIONES
                </p>
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
