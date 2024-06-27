// AutoresSlider.js
import React, { useEffect, useState } from "react";
import Slider from "../Slider";

function AutoresSlider() {
  const [autores, setAutores] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [citacionesTotales, setCitacionesTotales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const autoresResponse = await getAutores();
      setAutores(autoresResponse.autores);
      const citaciones = await Promise.all(
        autoresResponse.autores.map((autor) =>
          getCitacionesTotales(autor["dc:identifier"])
        )
      );
      setCitacionesTotales(citaciones);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % autores.length);
    }, 5000); // Cambiar a 5000 ms (5 segundos)
    return () => clearInterval(timer);
  }, [autores]);

  return (
    <Slider
      autores={autores}
      currentIndex={currentIndex}
      citacionesTotales={citacionesTotales}
    />
  );
}

export default AutoresSlider;
