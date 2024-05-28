// Slider.js
import React from 'react';
import AutorSlide from '../AutorSlide';

function Slider({ autores, currentIndex, citacionesTotales }) {
  return (
    <div className="slider">
      {autores.map((autor, index) => (
        <AutorSlide
          key={index}
          autor={autor}
          totalCitas={citacionesTotales[index]}
          isVisible={index === currentIndex}
        />
      ))}
    </div>
  );
}

export default Slider;
