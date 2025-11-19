import {
  validateAutorId,
  validateNombre,
  validateGradosAcademicos,
  validateFormData,
} from "../../utils/validators";

describe("validators", () => {
  describe("validateAutorId", () => {
    test("retorna null para un ID válido", () => {
      expect(validateAutorId("123456789")).toBeNull();
    });

    test("retorna error para ID vacío", () => {
      expect(validateAutorId("")).toBe("El Autor ID es requerido");
      expect(validateAutorId("   ")).toBe("El Autor ID es requerido");
    });

    test("retorna error para ID con caracteres no numéricos", () => {
      expect(validateAutorId("123abc")).toBe("El Autor ID debe contener solo números");
      expect(validateAutorId("abc123")).toBe("El Autor ID debe contener solo números");
    });
  });

  describe("validateNombre", () => {
    test("retorna null para un nombre válido", () => {
      expect(validateNombre("Juan Pérez")).toBeNull();
    });

    test("retorna error para nombre vacío", () => {
      expect(validateNombre("")).toBe("El nombre es requerido");
      expect(validateNombre("   ")).toBe("El nombre es requerido");
    });

    test("retorna error para nombre muy corto", () => {
      expect(validateNombre("A")).toBe("El nombre debe tener al menos 2 caracteres");
    });
  });

  describe("validateGradosAcademicos", () => {
    test("retorna null para grados válidos", () => {
      expect(validateGradosAcademicos(["PhD", "Master"])).toBeNull();
    });

    test("retorna error para array vacío", () => {
      expect(validateGradosAcademicos([])).toBe("Debe agregar al menos un grado académico");
    });

    test("retorna error para null o undefined", () => {
      expect(validateGradosAcademicos(null)).toBe("Debe agregar al menos un grado académico");
      expect(validateGradosAcademicos(undefined)).toBe("Debe agregar al menos un grado académico");
    });
  });

  describe("validateFormData", () => {
    test("retorna válido para datos correctos", () => {
      const formData = {
        autor_id: "123456789",
        nombre: "Juan Pérez",
        grado_academico: ["PhD"],
      };
      const result = validateFormData(formData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    test("retorna errores para datos inválidos", () => {
      const formData = {
        autor_id: "",
        nombre: "A",
        grado_academico: [],
      };
      const result = validateFormData(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.autor_id).toBeDefined();
      expect(result.errors.nombre).toBeDefined();
      expect(result.errors.grado_academico).toBeDefined();
    });
  });
});

