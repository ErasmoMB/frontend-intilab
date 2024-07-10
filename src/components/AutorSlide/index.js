import React, { useEffect, useState } from "react";
import "./style.css";

import uch from "../../assets/Logos/logo-uch.png";
import intilab from "../../assets/Logos/intilab.png";
import ehealth from "../../assets/Logos/ehealth.png";
import ciics from "../../assets/Logos/ciics.png";

import { getDatos, getCitacionesTotales } from "../Api";

const AutorSlide = () => {
  const [autores, setAutores] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [totalCitas, setTotalCitas] = useState(0); // Estado para almacenar el total de citas

  useEffect(() => {
    const fetchAutores = async () => {
      try {
        const data = await getDatos(); // Obtener datos de autores
        setAutores(data);
      } catch (error) {
        console.error("Error al obtener los autores:", error);
      }
    };

    fetchAutores();
  }, []);

  useEffect(() => {
    const fetchTotalCitas = async () => {
      if (autores.length > 0) {
        const citas = await getCitacionesTotales(autores[currentIndex].id);
        setTotalCitas(citas);
      }
    };

    fetchTotalCitas();

    if (autores.length > 0) {
      const intervalId = setInterval(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % autores.length);
          setIsAnimating(false);
        }, 1000); // Duración de la animación (1s)
      }, 5000); // Cambia de autor cada 5 segundos

      return () => clearInterval(intervalId);
    }
  }, [autores, currentIndex]);

  if (autores.length === 0) {
    return <div>Cargando autores...</div>;
  }

  const autor = autores[currentIndex];

  const getFontSize = (index) => {
    const baseSize = 2.5; // Tamaño base de la fuente
    const decrement = 0.5; // Decremento por cada índice
    return `${baseSize - index * decrement}rem`;
  };

  // Verificar si autor.documentos está definido antes de acceder a su propiedad length
  const numDocumentos = autor.documentos ? autor.documentos.length : 0;

  return (
    <section className="author-banner">
      <div className={`slider ${isAnimating ? "slide-animate" : ""}`}>
        <div className="row">
          <div className="col-12 col-sm-4 col-md-3 col-lg-2 autor-img d-flex justify-content-center align-items-center">
            <img
              src={autor.rutaImagen} // Asegúrate de que la estructura del autor coincida con los datos devueltos por getDatos()
              alt={`Imagen de ${autor.nombre}`}
              className="img-fluid"
            />
          </div>
          <div className="col-12 col-sm-8 col-md-6 col-lg-6 datos-autor">
            <div className="author-research-output">
              <div className="author-name">
                <h1>{autor.nombre}</h1>
                {autor.gradosAcademicos.map((grado, index) => (
                  <h5 key={index} style={{ fontSize: getFontSize(index) }}>
                    {grado}
                  </h5>
                ))}
              </div>
              <div className="detalles-autor">
                <div className="author-citations">
                  <h1>N°{totalCitas}</h1>
                  <p>citaciones de {numDocumentos} documentos</p>
                </div>
                <div>
                  <h1>{numDocumentos}</h1>
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
};

export default AutorSlide;
