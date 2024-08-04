import React from "react";

const AuthorDetails = ({ autor }) => {
  return (
    <div className="author-details">
      <div className="datos-autor">
        <div className="author-research-output">
          <div className="author-name">
            <h1>{autor.nombreCompleto}</h1>
            <div className="academic-degrees">
              {autor.gradosAcademicos.split("<br>").map((grado, index) => (
                <h5 key={index}>{grado}</h5>
              ))}
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
