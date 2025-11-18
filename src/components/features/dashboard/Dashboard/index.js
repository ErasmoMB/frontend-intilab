import React, { useState, useCallback, memo, useEffect } from "react";
import Navbar from "../../../layout/Navbar";
import Sidebar from "../../../layout/Sidebar";
import Totals from "../Totals";
import Charts from "../Charts";
import { debounce } from "../../../../utils/debounce";
import "./styles.css";

const Dashboard = memo(() => {
  const [chartType, setChartType] = useState("all-charts");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile((prev) => {
        if (prev !== mobile) {
          if (!mobile) {
            setSidebarOpen(true);
            setSidebarCollapsed(false);
          } else {
            setSidebarOpen(false);
            setSidebarCollapsed(false);
          }
          return mobile;
        }
        return prev;
      });
    };

    handleResize();
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
      setSidebarCollapsed((prev) => {
        if (prev) {
          setSidebarOpen(true);
        }
        return !prev;
      });
    }
  }, [isMobile]);

  return (
    <div className="dashboard-container">
      <Navbar 
        onMenuClick={toggleSidebar} 
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
      />
      <Sidebar 
        setChartType={handleChartTypeChange} 
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        setIsOpen={setSidebarOpen}
      />
      <div className={`dashboard-main ${!isMobile && sidebarOpen && !sidebarCollapsed ? "sidebar-visible" : ""} ${!isMobile && sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <Totals />
        <Charts chartType={chartType} />
      </div>
    </div>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;

