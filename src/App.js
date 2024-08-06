import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Cambiar Switch por Routes
import AutoresSlider from "./components/AutorSlider";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {" "}
          {/* Cambiar Switch por Routes */}
          <Route path="/" element={<AutoresSlider />} />{" "}
          {/* Cambiar component por element */}
          <Route path="/dashboard" element={<Dashboard />} />{" "}
          {/* Cambiar component por element */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
