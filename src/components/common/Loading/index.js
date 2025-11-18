import React, { memo } from "react";
import "./Loading.css";

const Loading = memo(({ message = "Cargando..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner" aria-label="Cargando"></div>
      <p className="loading-message">{message}</p>
    </div>
  );
});

Loading.displayName = "Loading";

export default Loading;

