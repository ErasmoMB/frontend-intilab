import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ sidebarCollapsed, isMobile, onMenuToggle }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-3 sm:px-4 lg:px-6 h-14 sm:h-16 min-h-14 sm:min-h-16 flex items-center">
      <div className="flex items-center justify-between w-full">
        {isMobile && (
          <button
            onClick={onMenuToggle}
            className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 sm:space-x-3 text-slate-300 hover:text-white p-1.5 sm:p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-slate-400">Administrador</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-semibold text-sm sm:text-base">A</span>
              </div>
              <svg className="w-4 h-4 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-slate-700 rounded-lg shadow-xl border border-slate-600 z-20">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-600 hover:text-white transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
