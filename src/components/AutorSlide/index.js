import React, { useEffect, useState } from "react";
import axios from "axios";
import "./style.css";

import uch from "../../assets/Logos/logo-uch.png";
import intilab from "../../assets/Logos/intilab.png";
import ehealth from "../../assets/Logos/ehealth.png";
import ciics from "../../assets/Logos/ciics.png";

const AutorSlide = () => {
  const [autores, setAutores] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const fetchAutores = async () => {
      const url = "http://127.0.0.1:2000/datos"; // Cambia la URL según tu configuración
      try {
        const response = await axios.get(url);
        setAutores(response.data);
      } catch (error) {
        console.error("Error al obtener los autores:", error);
      }
    };

    fetchAutores();
  }, []);

  useEffect(() => {
    if (autores.length > 0) {
      const intervalId = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % autores.length);
          setIsAnimating(false);
        }, 1000); // Duración de la animación (1s)
      }, 8000); // Cambia de autor cada 5 segundos

      return () => clearInterval(intervalId);
    }
  }, [autores]);

  if (autores.length === 0) {
    return <div>Cargando autores...</div>;
  }

  const autor = autores[currentIndex];

  const getFontSize = (index) => {
    const baseSize = 2.5; // Tamaño base de la fuente
    const decrement = 0.5; // Decremento por cada índice
    return `${baseSize - index * decrement}rem`;
  };

  return (
    <section className="author-banner">
      <div className={`slider ${isAnimating ? "slide-animate" : ""}`}>
        <div className="row">
          <div className="col-12 col-sm-4 col-md-3 col-lg-2 autor-img d-flex justify-content-center align-items-center">
            <img
              src={autor.ruta_imagen}
              alt={`Imagen de ${autor.nombre}`}
              className="img-fluid"
            />
          </div>
          <div className="col-12 col-sm-8 col-md-6 col-lg-6 datos-autor">
            <div className="author-research-output">
              <div className="author-name">
                <h1>{autor.nombre}</h1>
                {autor.grado_academico.map((grado, index) => (
                  <h5 key={index} style={{ fontSize: getFontSize(index) }}>
                    {grado}
                  </h5>
                ))}
              </div>
              <div className="detalles-autor">
                {/* Agrega detalles adicionales del autor si es necesario */}
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
};

export default AutorSlide;
