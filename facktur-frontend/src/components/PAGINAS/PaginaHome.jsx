import React from 'react'
import "../../styles/home/styleHome.css"
import { PaginaInfoUsuario } from './PaginaInfoUsuario'
import { Link } from 'react-router-dom'  // Importamos Link para navegar a la página de login

export const PaginaHome = () => {

    // Obtener el tipo de usuario que está autenticado de localStorage o del token
    const tipoUsuario = localStorage.getItem("tipo"); 
    const token = localStorage.getItem("token");  // Comprobamos si hay un token de autenticación
    
    // Si no hay tipo de usuario o token, consideramos que el usuario no está autenticado
    const estaAutenticado = tipoUsuario && token;

    return (
        <div className='div-home'>
            <div className='div-contentido'>
                <div className='div_invisible'>{/*Este div simula el div del menu flotante*/}</div>
                
                {/* Si el usuario está autenticado */}
                {estaAutenticado ? (
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
