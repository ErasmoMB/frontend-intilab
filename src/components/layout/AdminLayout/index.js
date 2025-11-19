import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../AdminSidebar";
import AdminNavbar from "../AdminNavbar";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(prev => !prev);
    } else {
      setSidebarCollapsed(prev => !prev);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <AdminSidebar 
        collapsed={sidebarCollapsed}
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onToggle={toggleSidebar}
        onClose={closeSidebar}
      />
      
      <div className={`transition-all duration-300 ${
        isMobile ? 'pl-0' : sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        <AdminNavbar 
          sidebarCollapsed={sidebarCollapsed}
          isMobile={isMobile}
          onMenuToggle={toggleSidebar}
        />
        
        <main className="p-2 sm:p-3 md:p-4 lg:p-6 w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
