import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export const ProtectedRoute = ({ element }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const url = `${API_URL}auth/check`;
        const response = await axios.get(url, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div className="mt-3 fs-5 fw-semibold text-primary">Cargando...</div>
        </div>
      </div>
    );

  return isAuthenticated ? element : <Navigate to="/" />;
};