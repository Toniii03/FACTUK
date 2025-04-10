import React from 'react';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ element, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }
  //renderiza el elemento pasado por el parametro element si esta autenticado
  return element;
};
