import React, { memo, useCallback } from "react";

const menuItems = [
    {
      id: "bar-chart",
      label: "Número de Documentos por Autor",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M7 12h10M7 8h6M7 16h8" />
        </svg>
      ),
    },
    {
      id: "pie-chart",
      label: "Distribución de Áreas de Especialización",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v20M12 2a10 10 0 0 1 8 8M12 2a10 10 0 0 0-8 8" />
        </svg>
      ),
    },
    {
      id: "citations-chart",
      label: "Número de Citas por Autor",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M9 9h6M9 15h6M9 12h6" />
        </svg>
      ),
    },
    {
      id: "all-charts",
      label: "Ver Todo",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
];

const Sidebar = memo(({ setChartType, isOpen, isCollapsed, setIsOpen, onToggle, isMobile }) => {
  const handleChartTypeChange = useCallback(
    (type) => {
      setChartType(type);
      if (isMobile) {
        setIsOpen(false);
      }
    },
    [setChartType, setIsOpen, isMobile]
  );

  return (
    <>
      {isMobile && (
        <div
          className={`sidebar-overlay ${isOpen ? "active" : ""}`}
          onClick={() => setIsOpen(false)}
        />
      )}
      <aside className={`dashboard-sidebar ${!isMobile || isOpen ? "open" : ""} ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!isCollapsed && <h2>Menú</h2>}
          {isMobile ? (
            <button
              className="sidebar-close"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar menú"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : (
            <button
              className="sidebar-toggle"
              onClick={onToggle}
              aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
            >
              {isCollapsed ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              )}
            </button>
          )}
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="sidebar-item"
              onClick={() => handleChartTypeChange(item.id)}
              title={isCollapsed ? item.label : ""}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {!isCollapsed && <span className="sidebar-label">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";

export default Sidebar;

