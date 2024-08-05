import React, { useEffect } from "react";
import Swiper from "swiper";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";
import useAutores from "../../hooks/useAutores";
import AutorSlide from "../Slider";
import Footer from "../Footer";
import "./styles.css";

const AutorSlider = () => {
  const { autoresData, loading, error } = useAutores();

  useEffect(() => {
    if (autoresData.length > 0) {
      const swiper = new Swiper(".swiper-container", {
        modules: [Autoplay, Pagination],
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 200000,
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
    return <div>Cargando investigadores...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="slider">
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
      </div>
      <Footer />
    </div>
  );
};

export default AutorSlider;
