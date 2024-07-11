import React, { useState, useEffect } from "react";
import {
  obtenerDatosBasicosAutores,
  obtenerAutores,
  obtenerDocumentos,
} from "../Api";
import "./styles.css"; // Importar estilos CSS

const AutorSlider = () => {
  const [autoresData, setAutoresData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoresLoadedCount, setAutoresLoadedCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener datos básicos de autores
        const datosResponse = await obtenerDatosBasicosAutores();
        const autoresData = datosResponse;

        // Obtener datos de autores y documentos combinados
        const autores = await obtenerAutores();
        const documentos = await obtenerDocumentos();

        // Procesar datos para cada autor
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

        // Establecer datos en el estado y contar autores cargados
        setAutoresData(autoresConDatosCompletos);
        setAutoresLoadedCount(autoresConDatosCompletos.length);

        // Desactivar loading
        setLoading(false);
        console.log("Se cargaron los 18 autores:", autoresConDatosCompletos);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setLoading(false); // Manejar error estableciendo loading como falso
      }
    };

    fetchData();
  }, []); // Solo se ejecuta una vez al montar el componente

  useEffect(() => {
    if (!loading && autoresData.length > 0) {
      // Activar el slider después de 2 minutos si no se ha alcanzado el número deseado
      const timeout = setTimeout(() => {
        const interval = setInterval(() => {
          setCurrentIndex((prevIndex) =>
            prevIndex === autoresData.length - 1 ? 0 : prevIndex + 1
          );
        }, 3000); // Cambia cada 3 segundos

        return () => clearInterval(interval);
      }, 120000); // 2 minutos en milisegundos

      return () => clearTimeout(timeout);
    }
  }, [autoresData, loading]);

  const handleClick = (index) => {
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? autoresData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === autoresData.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="container">
      <h1 className="mt-4">Slider de Autores</h1>
      <div className="slider">
        {/* Flecha izquierda */}
        <div className="arrow left-arrow" onClick={handlePrev}>
          &#60;
        </div>
        {/* Renderizar el contenido del slider */}
        {loading ? (
          <div>Cargando datos...</div>
        ) : (
          autoresData.map((autor, index) => (
            <div
              className={`slider-content ${
                index === currentIndex ? "active-slide" : ""
              }`}
              key={autor.autorId}
              style={{
                transform: `translateX(${(index - currentIndex) * 100}%)`,
              }}
              onClick={() => handleClick(index)}
            >
              <img
                src={autor.rutaImagen}
                alt={`Imagen de ${autor.nombreCompleto}`}
              />
              <h2>{autor.nombreCompleto}</h2>
              <p
                dangerouslySetInnerHTML={{
                  __html: autor.gradosAcademicos,
                }}
              ></p>
              <p>Total de Citas: {autor.totalCitas}</p>
              <p>Total de Documentos: {autor.totalDocumentos}</p>
            </div>
          ))
        )}
        {/* Flecha derecha */}
        <div className="arrow right-arrow" onClick={handleNext}>
          &#62;
        </div>
      </div>
    </div>
  );
};

export default AutorSlider;
