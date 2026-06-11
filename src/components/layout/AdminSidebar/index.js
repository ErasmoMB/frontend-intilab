import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AdminSidebar = ({ collapsed, isOpen, isMobile, onToggle, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: "actualizar-datos",
      label: "Actualizar Datos",
      path: "/admin/actualizar-datos",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
    },
    {
      id: "investigadores",
      label: "Investigadores",
      path: "/admin/investigadores",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      id: "configuracion",
      label: "Configuración",
      path: "/admin/configuracion",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const sidebarWidth = collapsed ? "w-20" : "w-64";
  const sidebarTransform = isMobile && !isOpen ? "-translate-x-full" : "translate-x-0";

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen bg-slate-800 border-r border-slate-700 transition-all duration-300 ease-in-out ${sidebarWidth} ${sidebarTransform} ${
          isMobile ? 'w-64' : ''
        }`}
      >
      <div className="flex flex-col h-full">
        <div className={`h-14 sm:h-16 min-h-14 sm:min-h-16 px-4 sm:px-6 border-b border-slate-700 flex items-center ${collapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
          {collapsed && !isMobile ? (
            <button
              onClick={onToggle}
              className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          ) : (
            <>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Administrador</h1>
              <button
                onClick={onToggle}
                className="text-slate-300 hover:text-white p-1 sm:p-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                aria-label={isMobile ? "Cerrar menú" : "Colapsar menú"}
              >
                {isMobile ? (
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                )}
              </button>
            </>
          )}
        </div>

        <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <div className="mb-6">
            {(!collapsed || isMobile) && (
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2 sm:px-3">
                MENU
              </p>
            )}
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavigation(item.path)}
                      className={`w-full flex items-center ${(collapsed && !isMobile) ? 'justify-center' : 'space-x-3'} px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base ${
                        active
                          ? (collapsed && !isMobile)
                            ? "bg-blue-600" 
                            : "bg-blue-600 text-white"
                          : "text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                      title={(collapsed && !isMobile) ? item.label : ''}
                    >
                      <span className={active ? "text-white" : ""}>
                        {item.icon}
                      </span>
                      {(!collapsed || isMobile) && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>
      </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
