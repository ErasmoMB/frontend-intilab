import React, { useState } from 'react';
import './style.css';
import qrImage from './img/encuesta.png'; // Asegúrate de que la ruta sea correcta

const Burbuja = () => {
    const [messageVisible, setMessageVisible] = useState(false);

    const handleClick = () => {
        setMessageVisible(true);
        setTimeout(() => {
            setMessageVisible(false);
        }, 3000); // Ocultar el mensaje después de 3 segundos
    };

    return (
        <div className="burbuja" onClick={handleClick}>
            <img src={qrImage} alt="QR Code" style={{ width: '100px', height: '100px' }} />
            {messageVisible && (
                <span className="tooltip-text">
                    ¡Por favor, llena la encuesta!
                </span>
            )}
        </div>
    );
};

export default Burbuja;