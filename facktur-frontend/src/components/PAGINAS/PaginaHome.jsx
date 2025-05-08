import React from 'react'
import "../../styles/home/styleHome.css"
import { PaginaInfoUsuario } from './PaginaInfoUsuario'

export const PaginaHome = () => {

    //Coger el tipo de usuario que esta autenticado de localStorage o del token
    const tipoUsuario = "normal"

  return (
    <div className='div-home'>
        <div className='div-contentido'>
            <div className='div_invisible'>{/*Este div simula el div del menu flotante*/}</div>
            {tipoUsuario === "admin" ? (
                    <div className='div-contenido_visible'>
                        {/*PAGINA QUE SE VE SI EL USUARIO ES ADMINISTRADO*/}
                        <PaginaInfoUsuario></PaginaInfoUsuario>
                    </div>
                ) : (
                    <div className='div-contenido_visible'>
                        {/*PAGINA QUE SE VE SI EL USUARIO ES NORMAL*/}
                        <PaginaInfoUsuario/>
                    
                    </div>
                )}
        </div>
    </div>
  )
}
