import React, { memo } from "react";
import "./ErrorMessage.css";

const ErrorMessage = memo(({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="error-container" role="alert">
      <div className="error-icon">⚠️</div>
      <p className="error-text">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button" type="button">
          Reintentar
        </button>
      )}
    </div>
  );
});

ErrorMessage.displayName = "ErrorMessage";

export default ErrorMessage;

