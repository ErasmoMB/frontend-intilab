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

export const fixEncoding = (str) => {
  if (!str || typeof str !== "string") return str;
  try {
    const fixed = decodeURIComponent(escape(str));
    return fixed;
  } catch (e) {
    try {
      const decoder = new TextDecoder("utf-8");
      const encoder = new TextEncoder();
      const bytes = encoder.encode(str);
      return decoder.decode(bytes);
    } catch (e2) {
      return str;
    }
  }
};

