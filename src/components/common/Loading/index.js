import React, { memo } from "react";

const Loading = memo(({ message = "Cargando..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" aria-label="Cargando"></div>
      <p className="text-slate-300 text-lg">{message}</p>
    </div>
  );
});

Loading.displayName = "Loading";

export default Loading;
