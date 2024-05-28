// AutoresSlider.js
import React, { useEffect, useState } from 'react';
import { getAutores, getCitacionesTotales } from '../Api';
import Slider from '../Slider';

function AutoresSlider() {
  const [autores, setAutores] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [citacionesTotales, setCitacionesTotales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const autoresResponse = await getAutores();
      setAutores(autoresResponse.autores);
      const citaciones = await Promise.all(autoresResponse.autores.map(autor => getCitacionesTotales(autor['dc:identifier'])));
      setCitacionesTotales(citaciones);
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCitaciones = async () => {
      if (autores.length > 0 && autores[currentIndex]) {
        const citaciones = await getCitacionesTotales(autores[currentIndex]['dc:identifier']);
        setCitacionesTotales(citaciones);
      }
    };
  
    fetchCitaciones();
  
    const timer = setInterval(() => {
      setCurrentIndex((currentIndex + 1) % autores.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [currentIndex, autores]);

  return (
    <Slider autores={autores} currentIndex={currentIndex} citacionesTotales={citacionesTotales} />
  );
}

export default AutoresSlider;
