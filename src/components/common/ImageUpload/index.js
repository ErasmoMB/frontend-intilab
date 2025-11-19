import React, { useState, useRef, useEffect } from "react";
import useApi from "../../../hooks/useApi";
import { subirLogo } from "../../../api/services/institucion.service";

const ImageUpload = ({ value, onChange, tipo, label, fallbackLocal }) => {
  const { loading, execute } = useApi();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(value || fallbackLocal || "");

  useEffect(() => {
    setPreview(value || fallbackLocal || "");
  }, [value, fallbackLocal]);

  const handleFileSelect = async (file) => {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const result = await execute(() => subirLogo(file, tipo));
    if (result.success) {
      const url = result.data.url;
      setPreview(url);
      onChange(url);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setPreview(url);
    onChange(url);
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="url"
            value={value || ""}
            onChange={handleUrlChange}
            className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://ejemplo.com/logo.png"
          />
        </div>
        
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleBrowseClick}
            disabled={loading}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Subiendo..." : "Explorar"}
          </button>
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-500/10"
            : "border-slate-600 bg-slate-700/50"
        }`}
      >
        <svg
          className="mx-auto h-12 w-12 text-slate-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="mt-2 text-sm text-slate-400">
          Arrastra y suelta una imagen aquí, o haz clic en "Explorar"
        </p>
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm text-slate-400 mb-2">
            {value ? "Vista previa actual:" : "Vista previa (local):"}
          </p>
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-600">
            <img
              src={preview}
              alt="Preview"
              className={`w-full object-contain rounded-lg ${
                tipo === "fondo-slider" ? "h-48" : "h-32"
              }`}
              onError={(e) => {
                if (fallbackLocal && e.target.src !== fallbackLocal) {
                  e.target.src = fallbackLocal;
                } else {
                  e.target.style.display = "none";
                }
              }}
            />
            {!value && fallbackLocal && (
              <p className="text-xs text-slate-500 mt-2 text-center">Logo local</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

