import React, { useEffect, useState } from 'react';
import "../../styles/home/styleHome.css";
import { PaginaInfoUsuario } from './PaginaInfoUsuario';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

export const PaginaHome = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const tipoUsuario = localStorage.getItem("tipo");
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}auth/check`, {
          withCredentials: true
        });
        setIsAuthenticated(response.status === 200);
      } catch (error) {
        setIsAuthenticated(false);
        navigate("/auth/login");
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

  return (
    <div className='div-home'>
      <div className='div-contentido'>
        <div className='div_invisible'></div>

        {isAuthenticated ? (
          <div className='div-contenido_visible'>
            {tipoUsuario === "ADM" ? (
              // Página para el usuario administrador
              <PaginaInfoUsuario />
            ) : (
              // Página para el usuario normal
              <PaginaInfoUsuario />
            )}
          </div>
        ) : (
          // Si no esta autenticado, mostramos un mensaje
          <div className='div-contenido_visible'>
            <div className='mensaje-contenedor'>
              <h2 className='mensaje-titulo'>No estás registrado</h2>
              <p className='mensaje-texto'>Para acceder a tu cuenta, por favor inicia sesión.</p>
              <Link to="/auth/login" className="link-sin-estilo">
                <button className='boton-iniciar-sesion'>Iniciar sesión</button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
