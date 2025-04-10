import React from 'react'
import "../../styles/home/styleHome.css"
import { Menu } from '../MENU/Menu'

export const PaginaHome = () => {

    const tipoUsuario = "normal"

  return (
    <div className='div-home'>
        <div className='div-menu'>
            <Menu></Menu>
        </div>
        <div className='div-contentido'>
            <div>{/*Este div simula el div del menu flotante*/}</div>
        {tipoUsuario === "admin" ? (
                <div>
                    <h1>Bienvenido, Administrador</h1>
                    <p>Este es el contenido exclusivo para administradores.</p>
                </div>
            ) : (
                <div>
                    <h1>Bienvenido, Usuario Normal</h1>
                    <p>Este es el contenido para usuarios normales.</p>
                </div>
            )}

        </div>
    </div>
  )
}
