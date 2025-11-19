export const calculateTotalDocuments = (documentos) => {
  if (!documentos?.documentos) return 0;
  let total = 0;
  Object.values(documentos.documentos).forEach((docsArray) => {
    if (Array.isArray(docsArray)) {
      total += docsArray.length;
    }
  });
  return total;
};

export const calculateTotalCitations = (documentos, autorId) => {
  if (!autorId || !documentos?.documentos?.[autorId]) return 0;
  return documentos.documentos[autorId].reduce((sum, documento) => {
    return sum + (parseInt(documento["citedby-count"]) || 0);
  }, 0);
};

export const calculateAuthorCitations = (author, documentos) => {
  const autorId = author["dc:identifier"]?.split(":")[1];
  return calculateTotalCitations(documentos, autorId);
};

export const formatAuthorName = (author) => {
  const givenName = author["preferred-name"]?.["given-name"] || "";
  const surname = author["preferred-name"]?.["surname"] || "";
  return `${surname}, ${givenName}`.trim() || "Nombre no disponible";
};

export const getAuthorId = (author) => {
  return author["dc:identifier"]?.split(":")[1];
};

