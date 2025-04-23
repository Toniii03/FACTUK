import React from 'react'
import "../../styles/menu/StyleMenu.css"
import logo from "../../logo.png"
import { Link } from 'react-router-dom';

export const Menu = () => {

    const tipoUsuario = "Normal"

  return (
        <div className="menu-container">
            <div className="menu-img">
                <div className='div-menu-img'>
                    <img src={logo} alt="Imagen de menú"/>
                </div>

                <div className="menu-links">
                    {(() => {
                        if (tipoUsuario === "admin") {
                            return (
                                <div className="card-nelace-menu">
                                <a href="./">ENLACE DE ADMIN</a>
                            </div>
                            );
                        }
                    })()}
                    <div className="card-nelace-menu">
                        <a href="./">Resumen</a>
                    </div>
                    <div className="card-nelace-menu">
                        <a href="./">Facturas</a>
                    </div>
                    <div className="card-nelace-menu">
                        <a href="./">Pagos</a>
                    </div>
                </div>
            </div>
            <div className='div-botones-login'>
                <div className='btnLogin'><Link to="/auth/login">Login</Link></div>
                <div className='btnLogin'><Link to="/auth/register">Registrarme</Link></div>
            </div>
        </div>
  )
}
