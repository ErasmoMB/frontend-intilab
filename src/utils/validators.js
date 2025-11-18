export const validateAutorId = (autorId) => {
  if (!autorId || !autorId.trim()) {
    return "El Autor ID es requerido";
  }
  if (!/^\d+$/.test(autorId.trim())) {
    return "El Autor ID debe contener solo números";
  }
  return null;
};

export const validateNombre = (nombre) => {
  if (!nombre || !nombre.trim()) {
    return "El nombre es requerido";
  }
  if (nombre.trim().length < 2) {
    return "El nombre debe tener al menos 2 caracteres";
  }
  return null;
};

export const validateGradosAcademicos = (grados) => {
  if (!grados || grados.length === 0) {
    return "Debe agregar al menos un grado académico";
  }
  return null;
};

export const validateFormData = (formData) => {
  const errors = {};

  const autorIdError = validateAutorId(formData.autor_id);
  if (autorIdError) errors.autor_id = autorIdError;

  const nombreError = validateNombre(formData.nombre);
  if (nombreError) errors.nombre = nombreError;

  const gradosError = validateGradosAcademicos(formData.grado_academico);
  if (gradosError) errors.grado_academico = gradosError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

