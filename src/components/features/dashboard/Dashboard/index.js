import React, { useState, useCallback, memo, useEffect } from "react";
import Navbar from "../../../layout/Navbar";
import Sidebar from "../../../layout/Sidebar";
import Totals from "../Totals";
import Charts from "../Charts";
import Loading from "../../../common/Loading";
import { debounce } from "../../../../utils/debounce";
import "./styles.css";

const Dashboard = memo(() => {
  const [chartType, setChartType] = useState("all-charts");
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const initLayout = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setSidebarCollapsed(mobile);
      setSidebarOpen(false);
      setIsReady(true);
    };

    initLayout();

    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      
      setIsMobile((prevMobile) => {
        if (prevMobile !== mobile) {
          if (mobile) {
            setSidebarCollapsed(true);
            setSidebarOpen(false);
          } else {
            setSidebarCollapsed(false);
            setSidebarOpen(false);
          }
          return mobile;
        }
        return prevMobile;
      });
    };

    const debouncedResize = debounce(handleResize, 150);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  const handleChartTypeChange = useCallback((type) => {
    setChartType(type);
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  }, [isMobile]);

  if (!isReady) {
    return (
      <div className="dashboard-container">
        <Navbar onMenuToggle={() => {}} isMobile={false} />
        <div className="dashboard-main" style={{ marginTop: '64px', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <Loading message="Cargando dashboard..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`dashboard-container mounted ${!isMobile && sidebarCollapsed ? "sidebar-collapsed" : ""} ${!isMobile && !sidebarCollapsed ? "sidebar-expanded" : ""}`}>
      <Navbar onMenuToggle={toggleSidebar} isMobile={isMobile} />
      <Sidebar 
        setChartType={handleChartTypeChange} 
        isOpen={!isMobile || sidebarOpen}
        isCollapsed={sidebarCollapsed}
        setIsOpen={setSidebarOpen}
        onToggle={toggleSidebar}
        isMobile={isMobile}
      />
      <div className={`dashboard-main ${!isMobile && !sidebarCollapsed ? "sidebar-visible" : ""} ${!isMobile && sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Totals />
        <Charts chartType={chartType} />
      </div>
    </div>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;

