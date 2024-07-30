import React, { useState, useEffect } from "react";
import Swiper from "swiper";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import {
  obtenerDatosBasicosAutores,
  obtenerAutores,
  obtenerDocumentos,
} from "../Api";
import AutorSlide from "../Slider";
import Footer from "../Footer";
import "./styles.css";

const AutorSlider = () => {
  const [autoresData, setAutoresData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [datosResponse, autoresResponse, documentosResponse] =
          await Promise.all([
            obtenerDatosBasicosAutores(),
            obtenerAutores(),
            obtenerDocumentos(),
          ]);

        const autoresData = datosResponse || [];
        const autores = autoresResponse || [];
        const documentos = documentosResponse || {};

        const autoresConDatosCompletos = autores.map((author) => {
          const autorId = author["dc:identifier"]?.split(":")[1];
          const autorData = autoresData.find(
            (item) => item.autor_id === autorId
          );
          let totalCitas = 0;
          let totalDocumentos = author["document-count"];

          if (documentos[autorId]) {
            totalCitas = documentos[autorId].reduce(
              (sum, documento) =>
                sum + parseInt(documento["citedby-count"]) || 0,
              0
            );
          }

          return {
            autorId: autorId || "",
            nombreCompleto: `${author["preferred-name"]?.["surname"] || ""}, ${
              author["preferred-name"]?.["given-name"] || ""
            }`,
            rutaImagen: autorData ? autorData.ruta_imagen : "",
            gradosAcademicos: autorData
              ? autorData.grado_academico.join("<br>")
              : "",
            totalCitas: totalCitas,
            totalDocumentos: totalDocumentos,
            areasTematicas: autorData ? autorData.areas_tematicas : [],
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
      const swiper = new Swiper(".swiper-container", {
        modules: [Autoplay, Pagination],
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3.5 },
        },
      });

      return () => {
        swiper.destroy();
      };
    }
  }, [autoresData]);

  if (loading) {
    return <div>Cargando autores...</div>;
  }

  return (
    <div className="main-container">
      <div className="content">
        <section className="swiper-container">
          <div className="swiper-wrapper">
            {autoresData.map((autor) => (
              <AutorSlide key={autor.autorId} autor={autor} />
            ))}
          </div>
          <div className="swiper-pagination"></div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AutorSlider;
