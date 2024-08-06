import React from "react";
import Navbar from "../Navbar"; // Asegúrate de que la ruta sea correcta
import Sidebar from "../Sidebar"; // Asegúrate de que la ruta sea correcta
import Totals from "../Totals"; // Asegúrate de que la ruta sea correcta
import Charts from "../Charts"; // Asegúrate de que la ruta sea correcta
import "./styles.css";

function Dashboard() {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <div id="main">
        <Totals />
        <Charts />
      </div>
    </div>
  );
}

export default Dashboard;
