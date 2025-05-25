import React, { useEffect, useState } from 'react';
import "../../styles/home/styleHome.css";
import { PaginaInfoUsuario } from './PaginaInfoUsuario';
import { Link } from 'react-router-dom';
import axios from 'axios'; 

export const PaginaHome = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true);
    const tipoUsuario = localStorage.getItem("tipo"); 

    useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:8080/auth/check', {
          withCredentials: true
        });

        setIsAuthenticated(response.status === 200);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

    if (loading) return <div>Cargando...</div>;

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
