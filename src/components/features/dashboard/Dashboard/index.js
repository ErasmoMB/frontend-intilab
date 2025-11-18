import React, { useState, useCallback, memo } from "react";
import Navbar from "../../../layout/Navbar";
import Sidebar from "../../../layout/Sidebar";
import Totals from "../Totals";
import Charts from "../Charts";
import "./styles.css";

const Dashboard = memo(() => {
  const [chartType, setChartType] = useState("all-charts");

  const handleChartTypeChange = useCallback((type) => {
    setChartType(type);
  }, []);

  return (
    <div>
      <Navbar setChartType={handleChartTypeChange} />
      <Sidebar setChartType={handleChartTypeChange} />
      <div id="main">
        <Totals />
        <Charts chartType={chartType} />
      </div>
    </div>
  );
});

Dashboard.displayName = "Dashboard";

export default Dashboard;

