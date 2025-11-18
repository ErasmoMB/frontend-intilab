import React, { memo } from "react";

const ErrorMessage = memo(({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8 bg-red-500/10 border border-red-500/50 rounded-lg my-4" role="alert">
      <div className="text-5xl mb-4">⚠️</div>
      <p className="text-red-400 text-lg text-center mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          type="button"
        >
          Reintentar
        </button>
      )}
    </div>
  );
});

ErrorMessage.displayName = "ErrorMessage";

export default ErrorMessage;
