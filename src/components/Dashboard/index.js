import React, { useState } from "react";
import Navbar from "../Navbar";
import Sidebar from "../Sidebar";
import Totals from "../Totals";
import Charts from "../Charts";
import "./styles.css";

function Dashboard() {
  const [chartType, setChartType] = useState("all-charts");

  return (
    <div>
      <Navbar setChartType={setChartType} />
      <Sidebar setChartType={setChartType} />
      <div id="main">
        <Totals />
        <Charts chartType={chartType} />
      </div>
    </div>
  );
}

export default Dashboard;
