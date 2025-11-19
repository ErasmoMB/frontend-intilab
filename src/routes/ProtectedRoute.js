import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Loading from "../components/common/Loading";
import { config } from "../config";

const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!authenticated) {
    return <Navigate to={config.ROUTES.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;

