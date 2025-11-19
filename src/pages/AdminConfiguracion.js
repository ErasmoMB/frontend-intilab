import React, { useState, useEffect } from "react";
import useApi from "../hooks/useApi";
import {
  obtenerConfiguracion,
  actualizarConfiguracion,
  inicializarConfiguracion,
} from "../api/services/institucion.service";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import ImageUpload from "../components/common/ImageUpload";

import logoCIICS from "../assets/Logos/ciics.png";
import logoEHealth from "../assets/Logos/ehealth.png";
import logoIntiLab from "../assets/Logos/intilab.png";
import logoUCH from "../assets/Logos/logo-uch.png";
import fondoDefault from "../assets/fondo.png";

const LOGOS_DEPARTAMENTOS_LOCALES = {
  ciics: logoCIICS,
  "e-health": logoEHealth,
  "ehealth": logoEHealth,
  "inti-lab": logoIntiLab,
  "intilab": logoIntiLab,
};

const AdminConfiguracion = () => {
  const { loading, error, execute } = useApi();
  const [config, setConfig] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [formData, setFormData] = useState({
    nombre: "",
    logo_principal_url: "",
    fondo_slider_url: "",
    afiliacion_ids: [],
    departamentos: {},
  });
  const [afiliacionInput, setAfiliacionInput] = useState("");
  const [editingAfiliacionIndex, setEditingAfiliacionIndex] = useState(null);
  const [departamentoForm, setDepartamentoForm] = useState({
    clave: "",
    nombre: "",
    af_id: "",
    logo_url: "",
  });
  const [showDepartamentoForm, setShowDepartamentoForm] = useState(false);
  const [editingDepartamento, setEditingDepartamento] = useState(null);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const cargarConfiguracion = async () => {
    try {
      setLoadingData(true);
      setFormError("");
      const result = await obtenerConfiguracion();
      if (result.success && result.data) {
        const data = result.data;
        setConfig(data);
        
        const departamentosConLogos = {};
        if (data.departamentos) {
          Object.entries(data.departamentos).forEach(([clave, dept]) => {
            departamentosConLogos[clave] = {
              nombre: dept.nombre || "",
              af_id: dept.af_id || "",
              logo_url: dept.logo_url || "",
            };
          });
        }
        
        setFormData({
          nombre: data.nombre || "",
          logo_principal_url: data.logo_principal_url || "",
          fondo_slider_url: data.fondo_slider_url || "",
          afiliacion_ids: data.afiliacion_ids || [],
          departamentos: departamentosConLogos,
        });
      } else {
        setFormError(result.error || "Error al cargar la configuración");
      }
    } catch (err) {
      setFormError(err.message || "Error al cargar la configuración");
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAfiliacion = () => {
    if (!afiliacionInput.trim()) return;

    const trimmedId = afiliacionInput.trim();

    if (editingAfiliacionIndex !== null) {
      if (formData.afiliacion_ids[editingAfiliacionIndex] !== trimmedId && formData.afiliacion_ids.includes(trimmedId)) {
        setFormError("Este ID ya existe");
        return;
      }
      setFormData((prev) => {
        const newIds = [...prev.afiliacion_ids];
        newIds[editingAfiliacionIndex] = trimmedId;
        return {
          ...prev,
          afiliacion_ids: newIds,
        };
      });
      setEditingAfiliacionIndex(null);
    } else {
      if (formData.afiliacion_ids.includes(trimmedId)) {
        setFormError("Este ID ya existe");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        afiliacion_ids: [...prev.afiliacion_ids, trimmedId],
      }));
    }
    setAfiliacionInput("");
    setFormError("");
  };

  const handleEditAfiliacion = (index) => {
    setAfiliacionInput(formData.afiliacion_ids[index]);
    setEditingAfiliacionIndex(index);
    setFormError("");
  };

  const handleCancelEditAfiliacion = () => {
    setAfiliacionInput("");
    setEditingAfiliacionIndex(null);
    setFormError("");
  };

  const handleRemoveAfiliacion = (index) => {
    if (editingAfiliacionIndex === index) {
      handleCancelEditAfiliacion();
    }
    setFormData((prev) => ({
      ...prev,
      afiliacion_ids: prev.afiliacion_ids.filter((_, i) => i !== index),
    }));
  };

  const handleDepartamentoInputChange = (e) => {
    const { name, value } = e.target;
    setDepartamentoForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddDepartamento = () => {
    if (!departamentoForm.clave || !departamentoForm.nombre || !departamentoForm.af_id) {
      setFormError("Todos los campos del departamento son requeridos");
      return;
    }

    const clave = departamentoForm.clave.toLowerCase().replace(/\s+/g, "-");
    const nuevoDept = {
      nombre: departamentoForm.nombre,
      af_id: departamentoForm.af_id,
    };
    
    if (departamentoForm.logo_url && departamentoForm.logo_url.trim()) {
      nuevoDept.logo_url = departamentoForm.logo_url.trim();
    }

    setFormData((prev) => ({
      ...prev,
      departamentos: {
        ...prev.departamentos,
        [clave]: nuevoDept,
      },
    }));

    setDepartamentoForm({ clave: "", nombre: "", af_id: "", logo_url: "" });
    setShowDepartamentoForm(false);
    setEditingDepartamento(null);
    setFormError("");
  };

  const handleEditDepartamento = (clave, dept) => {
    setDepartamentoForm({
      clave: clave,
      nombre: dept.nombre,
      af_id: dept.af_id,
      logo_url: dept.logo_url || "",
    });
    setEditingDepartamento(clave);
    setShowDepartamentoForm(true);
  };

  const handleUpdateDepartamento = () => {
    if (!departamentoForm.nombre || !departamentoForm.af_id) {
      setFormError("Nombre y AF-ID son requeridos");
      return;
    }

    const deptActualizado = {
      nombre: departamentoForm.nombre,
      af_id: departamentoForm.af_id,
    };
    
    if (departamentoForm.logo_url && departamentoForm.logo_url.trim()) {
      deptActualizado.logo_url = departamentoForm.logo_url.trim();
    }

    setFormData((prev) => ({
      ...prev,
      departamentos: {
        ...prev.departamentos,
        [editingDepartamento]: deptActualizado,
      },
    }));

    setDepartamentoForm({ clave: "", nombre: "", af_id: "", logo_url: "" });
    setShowDepartamentoForm(false);
    setEditingDepartamento(null);
    setFormError("");
  };

  const handleDeleteDepartamento = (clave) => {
    if (window.confirm(`¿Estás seguro de eliminar el departamento "${formData.departamentos[clave]?.nombre}"?`)) {
      const newDepartamentos = { ...formData.departamentos };
      delete newDepartamentos[clave];
      setFormData((prev) => ({
        ...prev,
        departamentos: newDepartamentos,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!formData.nombre.trim()) {
      setFormError("El nombre de la institución es requerido");
      return;
    }

    const departamentosLimpios = {};
    Object.entries(formData.departamentos).forEach(([clave, dept]) => {
      const deptLimpio = {
        nombre: dept.nombre,
        af_id: dept.af_id,
      };
      if (dept.logo_url && dept.logo_url.trim()) {
        deptLimpio.logo_url = dept.logo_url.trim();
      }
      departamentosLimpios[clave] = deptLimpio;
    });

    const updateData = {
      nombre: formData.nombre.trim(),
      afiliacion_ids: formData.afiliacion_ids,
      departamentos: departamentosLimpios,
    };

    if (formData.logo_principal_url && formData.logo_principal_url.trim()) {
      updateData.logo_principal_url = formData.logo_principal_url.trim();
    }

    if (formData.fondo_slider_url && formData.fondo_slider_url.trim()) {
      updateData.fondo_slider_url = formData.fondo_slider_url.trim();
    }

    const result = await execute(async () => {
      const res = await actualizarConfiguracion(updateData);
      if (res.success) {
        return res.data;
      }
      throw new Error(res.error);
    });

    if (result.success) {
      setSuccessMessage("Configuración actualizada correctamente");
      cargarConfiguracion();
      setTimeout(() => setSuccessMessage(""), 3000);
    } else {
      setFormError(result.error || "Error al actualizar la configuración");
    }
  };

  const handleInicializar = async () => {
    if (window.confirm("¿Estás seguro de inicializar la configuración con valores por defecto? Esto sobrescribirá la configuración actual.")) {
      const result = await execute(async () => {
        const res = await inicializarConfiguracion();
        if (res.success) {
          return res.data?.configuracion || res.data;
        }
        throw new Error(res.error);
      });
      if (result.success) {
        setSuccessMessage("Configuración inicializada correctamente");
        cargarConfiguracion();
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading message="Cargando configuración..." />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Configuración de Institución</h1>
        <p className="text-slate-400">Gestiona la información y configuración de tu institución</p>
      </div>

      {(error || formError) && (
        <div className="mb-6">
          <ErrorMessage 
            message={error || formError} 
            onRetry={cargarConfiguracion} 
          />
        </div>
      )}

      {successMessage && (
        <div className="mb-6 bg-green-500/10 border border-green-500/50 rounded-lg p-4">
          <p className="text-green-400">{successMessage}</p>
        </div>
      )}

      {!config && !loading && (
        <div className="mb-6 bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-4">
          <p className="text-yellow-400 mb-3">No se encontró configuración. ¿Deseas inicializar con valores por defecto?</p>
          <button
            type="button"
            onClick={handleInicializar}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-colors"
          >
            Inicializar Configuración
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Información General</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nombre de la Institución *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Universidad de Ciencias y Humanidades"
              />
            </div>

            <ImageUpload
              label="Logo Principal"
              value={formData.logo_principal_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, logo_principal_url: url }))}
              tipo="principal"
              fallbackLocal={logoUCH}
            />

            <ImageUpload
              label="Fondo del Slider"
              value={formData.fondo_slider_url}
              onChange={(url) => setFormData((prev) => ({ ...prev, fondo_slider_url: url }))}
              tipo="fondo-slider"
              fallbackLocal={fondoDefault}
            />
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">IDs de Afiliación Scopus</h2>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={afiliacionInput}
                onChange={(e) => setAfiliacionInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAfiliacion();
                  }
                  if (e.key === "Escape") {
                    e.preventDefault();
                    handleCancelEditAfiliacion();
                  }
                }}
                placeholder={editingAfiliacionIndex !== null ? "Editar ID de afiliación" : "Agregar ID de afiliación"}
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {editingAfiliacionIndex !== null && (
                <button
                  type="button"
                  onClick={handleCancelEditAfiliacion}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              )}
              <button
                type="button"
                onClick={handleAddAfiliacion}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                {editingAfiliacionIndex !== null ? "Actualizar" : "Agregar"}
              </button>
            </div>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{formError}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {formData.afiliacion_ids.map((id, index) => (
                <span
                  key={index}
                  className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm transition-colors ${
                    editingAfiliacionIndex === index
                      ? "bg-blue-600/40 border-2 border-blue-400 text-blue-200"
                      : "bg-blue-600/20 border border-blue-500/50 text-blue-300"
                  }`}
                >
                  <span>{id}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEditAfiliacion(index)}
                      className="text-blue-300 hover:text-blue-200 transition-colors"
                      title="Editar"
                    >
                      ✎
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveAfiliacion(index)}
                      className="text-blue-300 hover:text-red-400 transition-colors"
                      title="Eliminar"
                    >
                      ×
                    </button>
                  </div>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Logos de Departamentos</h2>
              <p className="text-slate-400 text-sm">Gestiona los logos de los departamentos</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowDepartamentoForm(!showDepartamentoForm);
                setEditingDepartamento(null);
                setDepartamentoForm({ clave: "", nombre: "", af_id: "", logo_url: "" });
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              {showDepartamentoForm ? "Cancelar" : "Agregar Departamento"}
            </button>
          </div>

          {showDepartamentoForm && (
            <div className="mb-4 p-4 bg-slate-700/50 rounded-lg space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Clave (ID) *
                  </label>
                  <input
                    type="text"
                    name="clave"
                    value={departamentoForm.clave}
                    onChange={handleDepartamentoInputChange}
                    disabled={!!editingDepartamento}
                    required
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ciics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={departamentoForm.nombre}
                    onChange={handleDepartamentoInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="CIICS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    AF-ID Scopus *
                  </label>
                  <input
                    type="text"
                    name="af_id"
                    value={departamentoForm.af_id}
                    onChange={handleDepartamentoInputChange}
                    required
                    className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="60171638"
                  />
                </div>
                <div className="md:col-span-2">
                  <ImageUpload
                    label="Logo del Departamento"
                    value={departamentoForm.logo_url}
                    onChange={(url) => setDepartamentoForm((prev) => ({ ...prev, logo_url: url }))}
                    tipo={`departamento-${departamentoForm.clave || 'temp'}`}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={editingDepartamento ? handleUpdateDepartamento : handleAddDepartamento}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                >
                  {editingDepartamento ? "Actualizar" : "Agregar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDepartamentoForm(false);
                    setEditingDepartamento(null);
                    setDepartamentoForm({ clave: "", nombre: "", af_id: "", logo_url: "" });
                  }}
                  className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {formError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{formError}</p>
            </div>
          )}

          <div className="space-y-4">
            {Object.keys(formData.departamentos).length === 0 ? (
              <p className="text-slate-400 text-sm">No hay departamentos configurados</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(formData.departamentos).map(([clave, dept]) => {
                  const logoLocal = LOGOS_DEPARTAMENTOS_LOCALES[clave.toLowerCase()] || null;
                  const logoSrc = dept.logo_url || logoLocal;
                  
                  return (
                    <div
                      key={clave}
                      className="relative group bg-slate-700/50 rounded-lg p-4 border border-slate-600"
                    >
                      <div className="flex flex-col items-center gap-3">
                        {logoSrc ? (
                          <div className="flex flex-col items-center gap-2 w-full">
                            <img
                              src={logoSrc}
                              alt={`Logo ${dept.nombre}`}
                              className="max-h-20 w-auto object-contain rounded"
                              onError={(e) => {
                                if (dept.logo_url && logoLocal && e.target.src !== logoLocal) {
                                  e.target.src = logoLocal;
                                } else {
                                  e.target.style.display = "none";
                                }
                              }}
                            />
                            {!dept.logo_url && logoLocal && (
                              <span className="text-xs text-slate-400">Logo local</span>
                            )}
                          </div>
                        ) : (
                          <div className="text-slate-500 text-sm text-center py-4">
                            Sin logo
                          </div>
                        )}
                        <div className="w-full text-center">
                          <h3 className="text-white font-semibold text-sm mb-1">{dept.nombre}</h3>
                          <p className="text-slate-400 text-xs">Clave: {clave}</p>
                          <p className="text-slate-400 text-xs">AF-ID: {dept.af_id}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-slate-900/90 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditDepartamento(clave, dept)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteDepartamento(clave)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Guardando..." : "Guardar Configuración"}
          </button>
          <button
            type="button"
            onClick={handleInicializar}
            disabled={loading}
            className="px-6 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Inicializar con Valores por Defecto
          </button>
        </div>
      </form>
    </>
  );
};

export default AdminConfiguracion;
