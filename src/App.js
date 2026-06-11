import React, { Suspense, lazy } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Loading from "./components/common/Loading";
import AdminLayout from "./components/layout/AdminLayout";
import { config } from "./config";

const AutoresSlider = lazy(() => import("./components/features/authors/AuthorSlider"));
const Dashboard = lazy(() => import("./components/features/dashboard/Dashboard"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminInvestigadores = lazy(() => import("./pages/AdminInvestigadores"));
const AdminConfiguracion = lazy(() => import("./pages/AdminConfiguracion"));
const AdminActualizarDatos = lazy(() => import("./pages/AdminActualizarDatos"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path={config.ROUTES.HOME} element={<AutoresSlider />} />
              <Route path={config.ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={config.ROUTES.LOGIN} element={<LoginPage />} />
              <Route
                path={config.ROUTES.ADMIN}
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to={config.ROUTES.ADMIN_DASHBOARD} replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="investigadores" element={<AdminInvestigadores />} />
                <Route path="configuracion" element={<AdminConfiguracion />} />
                <Route path="actualizar-datos" element={<AdminActualizarDatos />} />
              </Route>
            </Routes>
          </Suspense>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
