import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  return isAuthenticated ? element : <Navigate to="/auth/login" />;
};
