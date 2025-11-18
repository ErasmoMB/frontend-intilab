export const formatNumber = (number) => {
  if (typeof number !== "number") return "0";
  return number.toLocaleString("es-PE");
};

export const formatAutorId = (autorId) => {
  if (!autorId) return "";
  return autorId.trim();
};

export const formatNombre = (nombre) => {
  if (!nombre) return "";
  return nombre.trim();
};

