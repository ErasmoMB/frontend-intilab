import React, { useState, useEffect } from "react";
import Slider from "../Slider";
import AutorSlide from "../AutorSlide";

function AutoresSlider() {
  const [autores] = useState([
    {
      nombre: "ROMERO ALVA VICTOR NIELS",
      descripcion: "MAGÍSTER EN EL ÁREA DE SISTEMA DE MISILES Y COSMONÁUTICA",
      bachiller:
        "BACHILLER EN INGENIERÍA ELECTRÓNICA CON MENCIÓN EN TELECOMUNICACIONES",
      image: require("../../assets/Investigadores/Victor_Romero.jpg"),
      citas: {
        numero: 14,
        documentos: 25,
      },
    },
    {
      nombre: "ROMERO ALVA VICTOR NIELS",
      descripcion: "MAGÍSTER EN EL ÁREA DE SISTEMA DE MISILES Y COSMONÁUTICA",
      bachiller:
        "BACHILLER EN INGENIERÍA ELECTRÓNICA CON MENCIÓN EN TELECOMUNICACIONES",
      image: require("../../assets/Investigadores/Victor_Romero.jpg"),
      citas: {
        numero: 14,
        documentos: 25,
      },
    },
    // Agrega más autores si es necesario
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % autores.length);
    }, 5000); // Cambiar a 5000 ms (5 segundos)

    return () => clearInterval(timer); // Limpia el intervalo al desmontar el componente
  }, [autores]);

  return (
    <AutorSlide
      autor={autores[currentIndex]}
      totalCitas={autores[currentIndex].citas.numero}
      isVisible={true} // Mostrar siempre el slide actual
    />
  );
}

export default AutoresSlider;
