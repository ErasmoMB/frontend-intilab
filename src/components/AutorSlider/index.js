import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import {
  obtenerDatosBasicosAutores,
  obtenerAutores,
  obtenerDocumentos,
} from "../Api";
import "./styles.css"; // Estilos CSS personalizados
import uch from "../../assets/Logos/logo-uch.png";
import intilab from "../../assets/Logos/intilab.png";
import ehealth from "../../assets/Logos/ehealth.png";
import ciics from "../../assets/Logos/ciics.png";

const AutorSlider = () => {
  const [autoresData, setAutoresData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState("left");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datosResponse = await obtenerDatosBasicosAutores();
        const autoresData = datosResponse;

        const autores = await obtenerAutores();
        const documentos = await obtenerDocumentos();

        const autoresConDatosCompletos = autores.map((author) => {
          const autorId = author["dc:identifier"].split(":")[1];
          const autorData = autoresData.find(
            (item) => item.autor_id === autorId
          );
          let totalCitas = 0;
          let totalDocumentos = author["document-count"];

          if (documentos[autorId]) {
            totalCitas = documentos[autorId].reduce(
              (sum, documento) => sum + parseInt(documento["citedby-count"]),
              0
            );
          }

          return {
            autorId: autorId,
            nombreCompleto: `${author["preferred-name"]["surname"]}, ${author["preferred-name"]["given-name"]}`,
            rutaImagen: autorData ? autorData.ruta_imagen : "",
            gradosAcademicos: autorData
              ? autorData.grado_academico.join("<br>")
              : "",
            totalCitas: totalCitas,
            totalDocumentos: totalDocumentos,
          };
        });

        setAutoresData(autoresConDatosCompletos);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (autoresData.length > 0) {
      const id = setInterval(() => {
        handleSlide("left");
      }, 10000);

      return () => clearInterval(id);
    }
  }, [autoresData]);

  const handleSlide = (direction) => {
    setIsAnimating(true);
    setSlideDirection(direction);

    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        if (direction === "left") {
          return prevIndex === autoresData.length - 1 ? 0 : prevIndex + 1;
        } else {
          return prevIndex === 0 ? autoresData.length - 1 : prevIndex - 1;
        }
      });
      setIsAnimating(false);
    }, 800);
  };

  const handleSwipeLeft = () => {
    handleSlide("left");
  };

  const handleSwipeRight = () => {
    handleSlide("right");
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
  });

  if (loading) {
    return <div>Cargando autores...</div>;
  }

  const autor = autoresData[currentIndex];

  const getFontSize = (index) => {
    const baseSize = 1.5; // Tamaño base inicial
    const decrement = 0.25; // Decremento de tamaño por cada grado académico

    // Limitar el tamaño mínimo después del tercer grado
    if (index >= 3) {
      return `${baseSize - 2 * decrement}rem`; // Tamaño fijo a partir del tercer grado
    }

    return `${baseSize - index * decrement}rem`; // Decremento normal hasta el tercer grado
  };

  return (
    <>
      <section className="author-banner">
        <div
          {...swipeHandlers}
          className={`slider ${
            isAnimating
              ? slideDirection === "left"
                ? "slide-left"
                : "slide-right"
              : ""
          }`}
        >
          <div className="container">
            <div className="row row-slider">
              <div className="col-md-4 col-xs-12 autor-image">
                <img
                  src={autor.rutaImagen}
                  alt={`Imagen de ${autor.nombreCompleto}`}
                  className="img-fluid autor-img"
                />
              </div>
              <div className="col-md-4 col-xs-12 author-details">
                <div className="datos-autor">
                  <div className="author-research-output">
                    <div className="author-name">
                      <h1>{autor.nombreCompleto}</h1>
                      {autor.gradosAcademicos
                        .split("<br>")
                        .map((grado, index) => (
                          <h5
                            key={index}
                            style={{ fontSize: getFontSize(index) }}
                          >
                            {grado}
                          </h5>
                        ))}
                    </div>
                    <div className="detalles-autor">
                      <div>
                        <h1>
                          N<span>ro </span>
                          {autor.totalCitas}
                        </h1>
                        <p>Citaciones</p>
                      </div>
                      <div className="documentos">
                        <h1>{autor.totalDocumentos}</h1>
                        <p>Documentos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col">
                {/* Aquí puedes insertar tus gráficos */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos al final de la página */}
      <footer className="footer">
        <div className="container">
          <div className="row justify-content-center align-items-center">
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
        </div>
      </footer>
    </>
  );
};

export default AutorSlider;
