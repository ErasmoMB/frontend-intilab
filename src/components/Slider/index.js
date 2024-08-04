import React from "react";
import AuthorDetails from "../AuthorDetails";
import ChartContainer from "../ChartContainer";

const AutorSlide = ({ autor }) => {
  console.log("Datos del autor:", autor);
  return (
    <div className="swiper-slide">
      <div className="slide-content">
        <div className="autor-image">
          <img
            src={autor.rutaImagen}
            alt={`Imagen de ${autor.nombreCompleto}`}
            className="img-fluid autor-img"
          />
        </div>
        <AuthorDetails autor={autor} />
        <div className="chart-container">
          <ChartContainer autor={autor} />
        </div>
      </div>
    </div>
  );
};

export default AutorSlide;
