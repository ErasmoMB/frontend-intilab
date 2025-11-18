import React, { useEffect, useRef, useMemo } from "react";
import Swiper from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import useAutores from "../../../../hooks/useAutores";
import AutorSlide from "../Slider";
import Footer from "../../../layout/Footer";
import Loading from "../../../common/Loading";
import ErrorMessage from "../../../common/ErrorMessage";
import "./styles.css";

const AutorSlider = () => {
  const { autoresData, loading, error } = useAutores();
  const swiperRef = useRef(null);

  const slidesData = useMemo(() => {
    if (!autoresData || autoresData.length === 0) return [];
    const minSlides = 60;
    const target = Math.max(autoresData.length, minSlides);
    return Array.from({ length: target }, (_, i) => autoresData[i % autoresData.length]);
  }, [autoresData]);

  useEffect(() => {
    if (slidesData.length > 0) {
      const urls = slidesData.map((a) => a.rutaImagen).filter(Boolean);
      urls.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [slidesData]);

  useEffect(() => {
    if (slidesData.length > 0 && swiperRef.current) {
      const swiper = new Swiper(swiperRef.current, {
        modules: [Autoplay, Pagination],
        slidesPerView: 1,
        centeredSlides: false,
        spaceBetween: 20,
        loop: false,
        rewind: true,
        watchSlidesProgress: true,
        preloadImages: true,
        initialSlide: 0,
        speed: 600,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
        },
        on: {
          reachEnd(sw) {
            sw.slideTo(0, 0);
          },
        },
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          480: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          640: {
            slidesPerView: 1.2,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 1.5,
            spaceBetween: 25,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          1280: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1600: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        },
      });

      return () => {
        if (swiper) {
          swiper.destroy(true, true);
        }
      };
    }
  }, [slidesData]);

  if (loading) {
    return <Loading message="Cargando investigadores..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="slider">
      <div className="main-container">
        <section className="swiper" ref={swiperRef}>
          <div className="swiper-wrapper">
            {slidesData.map((autor, i) => (
              <AutorSlide key={`${autor.autorId}-${i}`} autor={autor} eager={i < 6} />
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

