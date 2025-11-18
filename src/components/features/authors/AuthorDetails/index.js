import React, { useMemo, memo } from "react";
import bachillerIcon from "./icons/bachiller.png";
import licenciadoIcon from "./icons/licenciado.png";
import doctorIcon from "./icons/doctor.png";
import magisterIcon from "./icons/magister.png";
import especialistaIcon from "./icons/especialista.png";
import diplomadoIcon from "./icons/diplomado.png";
import "./styles.css";

const iconMap = {
  bachiller: bachillerIcon,
  licenciada: licenciadoIcon,
  licenciado: licenciadoIcon,
  magister: magisterIcon,
  magíster: magisterIcon,
  doctor: doctorIcon,
  especialista: especialistaIcon,
  especialización: especialistaIcon,
  diplomado: diplomadoIcon,
};

const AuthorDetails = memo(({ autor }) => {
  const gradosAcademicos = useMemo(() => {
    return autor.gradosAcademicos.split("<br>").map((grado, index) => {
      const trimmedGrado = grado.trim();
      const firstWord = trimmedGrado.split(" ")[0].toLowerCase();
      let icon = iconMap[firstWord] || null;
      let degreeClass = "";

      if (trimmedGrado.toLowerCase().startsWith("doctor")) {
        degreeClass = "doctor";
        icon = iconMap["doctor"];
      } else if (
        trimmedGrado.toLowerCase().startsWith("magister") ||
        trimmedGrado.toLowerCase().startsWith("magíster")
      ) {
        degreeClass = "magister";
        icon = iconMap["magister"];
      } else if (
        trimmedGrado.toLowerCase().startsWith("especialista")
      ) {
        degreeClass = "especialista";
        icon = iconMap["especialista"];
      } else if (
        trimmedGrado.toLowerCase().startsWith("licenciado")
      ) {
        degreeClass = "licenciado";
        icon = iconMap["licenciado"];
      } else if (trimmedGrado.toLowerCase().startsWith("bachiller")) {
        degreeClass = "bachiller";
        icon = iconMap["bachiller"];
      } else if (
        trimmedGrado.toLowerCase().startsWith("segunda especialidad")
      ) {
        degreeClass = "especialista";
        icon = iconMap["especialista"];
      } else if (
        trimmedGrado.toLowerCase().startsWith("licenciada")
      ) {
        degreeClass = "licenciada";
        icon = iconMap["licenciada"];
      } else if (trimmedGrado.toLowerCase().startsWith("diplomado")) {
        degreeClass = "diplomado";
        icon = iconMap["diplomado"];
      }

      return { grado, icon, degreeClass, index };
    });
  }, [autor.gradosAcademicos]);

  return (
    <div className="author-details">
      <div className="author-name">
        <h1>{autor.nombreCompleto}</h1>
      </div>
      <div className="academic-degrees">
        {gradosAcademicos.map(({ grado, icon, degreeClass, index }) => (
          <h5 key={index} className={degreeClass}>
            {icon && (
              <img
                src={icon}
                alt={degreeClass}
                style={{ marginRight: "5px", width: "25px" }}
                loading="lazy"
              />
            )}
            {grado}
          </h5>
        ))}
      </div>
    </div>
  );
});

AuthorDetails.displayName = "AuthorDetails";

export default AuthorDetails;

