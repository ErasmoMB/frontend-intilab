import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import useApi from "../hooks/useApi";
import {
  obtenerInvestigadores,
  crearInvestigador,
  actualizarInvestigador,
  eliminarInvestigador,
} from "../api/services/investigadores.service";
import { validateFormData } from "../utils/validators";
import Loading from "../components/common/Loading";
import ErrorMessage from "../components/common/ErrorMessage";
import "./AdminPage.css";

const AdminPage = () => {
  const { logout } = useAuth();
  const { loading, error, execute } = useApi();
  const [investigadores, setInvestigadores] = useState([]);
  const [formError, setFormError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    autor_id: "",
    nombre: "",
    grado_academico: [],
  });
  const [gradoInput, setGradoInput] = useState("");

  useEffect(() => {
    cargarInvestigadores();
  }, []);

  const cargarInvestigadores = async () => {
    const result = await execute(() => obtenerInvestigadores());
    if (result.success) {
      setInvestigadores(result.data);
    }
  };

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
      <div className="admin-container">
        <Loading message="Cargando investigadores..." />
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Gestión de Investigadores</h1>
        <button onClick={logout} className="logout-button">
          Cerrar Sesión
        </button>
      </div>

      {error && (
        <ErrorMessage message={error} onRetry={cargarInvestigadores} />
      )}

      <div className="admin-actions">
        <button onClick={() => setShowForm(!showForm)} className="add-button">
          {showForm ? "Cancelar" : "Agregar Investigador"}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h2>{editingId ? "Editar" : "Nuevo"} Investigador</h2>
          {formError && <div className="error-message">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Autor ID</label>
              <input
                type="text"
                name="autor_id"
                value={formData.autor_id}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Grados Académicos</label>
              <div className="grado-input-group">
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
                />
                <button type="button" onClick={handleAddGrado}>
                  Agregar
                </button>
              </div>
              <div className="grados-list">
                {formData.grado_academico.map((grado, index) => (
                  <span key={index} className="grado-tag">
                    {grado}
                    <button
                      type="button"
                      onClick={() => handleRemoveGrado(index)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Imagen</label>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">
                {editingId ? "Actualizar" : "Crear"}
              </button>
              <button type="button" onClick={resetForm} className="cancel-button">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-container">
        <table className="investigadores-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Autor ID</th>
              <th>Nombre</th>
              <th>Grados Académicos</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {investigadores.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-message">
                  No hay investigadores registrados
                </td>
              </tr>
            ) : (
              investigadores.map((inv) => (
                <tr key={inv._id}>
                  <td>{inv._id}</td>
                  <td>{inv.autor_id}</td>
                  <td>{inv.nombre}</td>
                  <td>
                    {inv.grado_academico?.join(", ") || "N/A"}
                  </td>
                  <td>
                    {inv.ruta_imagen ? (
                      <img
                        src={inv.ruta_imagen}
                        alt={inv.nombre}
                        className="investigador-image"
                      />
                    ) : (
                      "Sin imagen"
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEdit(inv)}
                      className="edit-button"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(inv._id)}
                      className="delete-button"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;

