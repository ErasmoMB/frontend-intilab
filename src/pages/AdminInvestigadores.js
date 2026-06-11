import React, { useState, useEffect, useCallback } from "react";
import useApi from "../hooks/useApi";
import {
  obtenerInvestigadores,
  crearInvestigador,
  actualizarInvestigador,
  eliminarInvestigador,
} from "../api/services/investigadores.service";
import { validateFormData } from "../utils/validators";
import { fixEncoding } from "../utils/formatters";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";

const AdminInvestigadores = () => {
  const { loading, error, execute } = useApi();
  const [investigadores, setInvestigadores] = useState([]);
  const [investigadoresFiltrados, setInvestigadoresFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    autor_id: "",
    nombre: "",
    grado_academico: [],
  });
  const [gradoInput, setGradoInput] = useState("");
  const [editingGradoIndex, setEditingGradoIndex] = useState(null);
  const [editingGradoValue, setEditingGradoValue] = useState("");

  const cargarInvestigadores = useCallback(async () => {
    const result = await execute(() => obtenerInvestigadores());
    if (result.success) {
      const investigadoresCorregidos = result.data.map((inv) => ({
        ...inv,
        nombre: fixEncoding(inv.nombre),
      }));
      setInvestigadores(investigadoresCorregidos);
      setInvestigadoresFiltrados(investigadoresCorregidos);
    }
  }, [execute]);

  useEffect(() => {
    cargarInvestigadores();
  }, [cargarInvestigadores]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setInvestigadoresFiltrados(investigadores);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = investigadores.filter(
        (inv) =>
          inv.nombre?.toLowerCase().includes(term) ||
          inv.autor_id?.toLowerCase().includes(term)
      );
      setInvestigadoresFiltrados(filtered);
    }
  }, [searchTerm, investigadores]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddGrado = () => {
    if (gradoInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        grado_academico: [...prev.grado_academico, gradoInput.trim()],
      }));
      setGradoInput("");
    }
  };

  const handleRemoveGrado = (index) => {
    setFormData((prev) => ({
      ...prev,
      grado_academico: prev.grado_academico.filter((_, i) => i !== index),
    }));
  };

  const handleEditGrado = (index, currentValue) => {
    setEditingGradoIndex(index);
    setEditingGradoValue(currentValue);
  };

  const handleSaveGrado = (index) => {
    if (editingGradoValue.trim()) {
      setFormData((prev) => {
        const nuevosGrados = [...prev.grado_academico];
        nuevosGrados[index] = editingGradoValue.trim();
        return {
          ...prev,
          grado_academico: nuevosGrados,
        };
      });
    }
    setEditingGradoIndex(null);
    setEditingGradoValue("");
  };

  const handleCancelEditGrado = () => {
    setEditingGradoIndex(null);
    setEditingGradoValue("");
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      imagen: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const validation = validateFormData(formData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setFormError(firstError);
      return;
    }

    const data = new FormData();
    data.append("autor_id", formData.autor_id.trim());
    data.append("nombre", formData.nombre.trim());
    formData.grado_academico.forEach((grado) => {
      data.append("grado_academico", grado);
    });
    if (formData.imagen) {
      data.append("imagen", formData.imagen);
    }

    const apiCall = editingId
      ? () => actualizarInvestigador(editingId, data)
      : () => crearInvestigador(data);

    const result = await execute(apiCall);
    if (result.success) {
      resetForm();
      cargarInvestigadores();
    } else {
      setFormError(result.error);
    }
  };

  const handleEdit = (investigador) => {
    setFormData({
      autor_id: investigador.autor_id || "",
      nombre: investigador.nombre || "",
      grado_academico: investigador.grado_academico || [],
      imagen: null,
    });
    setEditingId(investigador._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este investigador?")) {
      const result = await execute(() => eliminarInvestigador(id));
      if (result.success) {
        cargarInvestigadores();
      }
    }
  };

  const resetForm = () => {
    setFormData({
      autor_id: "",
      nombre: "",
      grado_academico: [],
      imagen: null,
    });
    setGradoInput("");
    setEditingId(null);
    setShowForm(false);
  };

  if (loading && investigadores.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loading message="Cargando investigadores..." />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Gestión de Investigadores</h1>
        <p className="text-slate-400">Administra la información de los investigadores</p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onRetry={cargarInvestigadores} />
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full sm:max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o autor ID..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{showForm ? "Cancelar" : "Agregar Investigador"}</span>
        </button>
      </div>

      {showForm && (
        <div className="mb-6 bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingId ? "Editar" : "Nuevo"} Investigador
          </h2>
          
          {formError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Autor ID
                </label>
                <input
                  type="text"
                  name="autor_id"
                  value={formData.autor_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ID del autor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre completo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Grados Académicos
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={gradoInput}
                  onChange={(e) => setGradoInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddGrado();
                    }
                  }}
                  placeholder="Agregar grado académico"
                  className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddGrado}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.grado_academico.map((grado, index) => (
                  editingGradoIndex === index ? (
                    <div
                      key={index}
                      className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-600/20 border border-blue-500/50 rounded-full"
                    >
                      <input
                        type="text"
                        value={editingGradoValue}
                        onChange={(e) => setEditingGradoValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSaveGrado(index);
                          } else if (e.key === "Escape") {
                            e.preventDefault();
                            handleCancelEditGrado();
                          }
                        }}
                        onBlur={() => handleSaveGrado(index)}
                        autoFocus
                        className="bg-transparent border-none outline-none text-blue-300 text-sm min-w-[200px]"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveGrado(index)}
                        className="text-blue-300 hover:text-green-400 transition-colors"
                        title="Guardar"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditGrado}
                        className="text-blue-300 hover:text-red-400 transition-colors"
                        title="Cancelar"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <span
                      key={index}
                      className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-600/20 border border-blue-500/50 rounded-full text-blue-300 text-sm cursor-pointer hover:bg-blue-600/30 transition-colors"
                      onClick={() => handleEditGrado(index, grado)}
                      title="Clic para editar"
                    >
                      <span>{grado}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveGrado(index);
                        }}
                        className="text-blue-300 hover:text-red-400 transition-colors"
                        title="Eliminar"
                      >
                        ×
                      </button>
                    </span>
                  )
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Autor ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Grados Académicos
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Imagen
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {investigadoresFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    {investigadores.length === 0
                      ? "No hay investigadores registrados"
                      : "No se encontraron investigadores con ese criterio de búsqueda"}
                  </td>
                </tr>
              ) : (
                investigadoresFiltrados.map((inv) => (
                  <tr key={inv._id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {inv._id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {inv.autor_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {inv.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      <div className="flex flex-wrap gap-1">
                        {inv.grado_academico?.slice(0, 2).map((grado, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-600/20 border border-blue-500/50 rounded text-blue-300 text-xs"
                          >
                            {grado}
                          </span>
                        ))}
                        {inv.grado_academico?.length > 2 && (
                          <span className="px-2 py-1 bg-slate-600 rounded text-slate-300 text-xs">
                            +{inv.grado_academico.length - 2}
                          </span>
                        )}
                        {!inv.grado_academico || inv.grado_academico.length === 0 ? (
                          <span className="text-slate-500">N/A</span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {inv.ruta_imagen ? (
                        <img
                          src={inv.ruta_imagen}
                          alt={inv.nombre}
                          className="w-12 h-12 object-cover rounded-lg border border-slate-600"
                        />
                      ) : (
                        <span className="text-slate-500 text-sm">Sin imagen</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(inv)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-xs font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(inv._id)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-xs font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminInvestigadores;

