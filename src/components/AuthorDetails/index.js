import React from "react";

// Importa las imágenes de los íconos
import bachillerIcon from "./icons/bachiller.png";
import licenciadoIcon from "./icons/licenciado.png";
import doctorIcon from "./icons/doctor.png";
import magisterIcon from "./icons/magister.png";
import especialistaIcon from "./icons/especialista.png";
import diplomadoIcon from "./icons/diplomado.png"; // Asegúrate de tener este ícono
import "./styles.css";

const iconMap = {
  bachiller: bachillerIcon,
  licenciada: licenciadoIcon,
  licenciado: licenciadoIcon,
  magister: magisterIcon,
  magíster: magisterIcon,
  doctor: doctorIcon,
  especialista: especialistaIcon,
  diplomado: diplomadoIcon, // Agrega el ícono para diplomado
};

const AuthorDetails = ({ autor }) => {
  return (
    <div className="author-details">
      <div className="datos-autor">
        <div className="author-research-output">
          <div className="author-name">
            <h1>{autor.nombreCompleto}</h1>
            <div className="academic-degrees">
              {autor.gradosAcademicos.split("<br>").map((grado, index) => {
                const trimmedGrado = grado.trim(); // Elimina espacios en blanco
                const firstWord = trimmedGrado.split(" ")[0].toLowerCase();
                let icon = iconMap[firstWord] || null; // Obtiene el ícono correspondiente
                let degreeClass = ""; // Clase para el grado académico

                // Verifica el tipo de grado y asigna la clase correspondiente
                if (trimmedGrado.toLowerCase().startsWith("doctor")) {
                  degreeClass = "doctor";
                  icon = iconMap["doctor"]; // Asigna el ícono de doctor
                } else if (
                  trimmedGrado.toLowerCase().startsWith("magister") ||
                  trimmedGrado.toLowerCase().startsWith("magíster")
                ) {
                  degreeClass = "magister";
                  icon = iconMap["magister"]; // Asigna el ícono de magister
                } else if (
                  trimmedGrado.toLowerCase().startsWith("especialista")
                ) {
                  degreeClass = "especialista";
                  icon = iconMap["especialista"]; // Asigna el ícono de especialista
                } else if (
                  trimmedGrado.toLowerCase().startsWith("licenciado")
                ) {
                  degreeClass = "licenciado";
                  icon = iconMap["licenciado"]; // Asigna el ícono de licenciado
                } else if (trimmedGrado.toLowerCase().startsWith("bachiller")) {
                  degreeClass = "bachiller";
                  icon = iconMap["bachiller"]; // Asigna el ícono de bachiller
                } else if (
                  trimmedGrado.toLowerCase().startsWith("segunda especialidad")
                ) {
                  degreeClass = "especialista"; // Asigna la clase de especialista
                  icon = iconMap["especialista"]; // Asigna el ícono de especialista
                } else if (
                  trimmedGrado.toLowerCase().startsWith("licenciada")
                ) {
                  degreeClass = "licenciada"; // Asigna la clase de licenciada
                  icon = iconMap["licenciada"]; // Asigna el ícono de licenciada
                } else if (trimmedGrado.toLowerCase().startsWith("diplomado")) {
                  degreeClass = "diplomado";
                  icon = iconMap["diplomado"]; // Asigna el ícono de diplomado
                }

                return (
                  <h5 key={index} className={degreeClass}>
                    {icon && (
                      <img
                        src={icon}
                        alt={firstWord}
                        style={{ marginRight: "5px", width: "25px" }}
                      />
                    )}{" "}
                    {/* Muestra el ícono */}
                    {grado} {/* Agrega el grado académico */}
                  </h5>
                );
              })}
            </div>
          </div>
          <div className="detalles-autor">
            <div className="citas">
              <h1>
                N<span>ro </span>
                <span className="numero-citas">{autor.totalCitas}</span>
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
  );
};

export default AuthorDetails;
