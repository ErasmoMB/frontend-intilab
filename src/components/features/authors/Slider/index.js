import React, { memo } from "react";
import AuthorDetails from "../AuthorDetails";
import ChartContainer from "../ChartContainer";

const AutorSlide = memo(({ autor, eager = false }) => {
  return (
    <div className="swiper-slide">
      <div className="slide-content">
        <div className="autor-image">
          <img
            src={autor.rutaImagen}
            alt={`Imagen de ${autor.nombreCompleto}`}
            className="img-fluid autor-img"
            loading={eager ? "eager" : undefined}
            fetchpriority={eager ? "high" : undefined}
          />
        </div>
        <AuthorDetails autor={autor} />
        <div className="detalles-autor">
          <div className="citas">
            <h1>
              N<span>ro </span>
              <span className="numero-citas">{autor.totalCitas}</span>
            </h1>
            <p>Citaciones</p>
          </div>
          <div className="documentos">
            <h1>{autor.totalDocumentos}</h1>
            <p>Documentos</p>
          </div>
        </div>
        <div className="chart-container">
          <ChartContainer autor={autor} />
        </div>
      </div>
    </div>
  );
});

AutorSlide.displayName = "AutorSlide";

export default AutorSlide;

