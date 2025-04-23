import React from 'react'
import "../../styles/paginas/paginaInfoUsuario.css"
import { usuarioRequest } from '../../Modelos/usuarioRequest'

export const PaginaInfoUsuario = () => {

    //DE MOMENTO USO DATOS ESTATICOS
    const usuario = new usuarioRequest ("Antonio","Caceres","toni@gmial.com","1234","normal")
    
  return (
    <div className="user-info">
        <div>
            <div><span className="label">Nombre:</span></div>
            <div><span className="value">Antonio</span></div>

            <div><span className="label">Apellido:</span></div>
            <div><span className="value">Caceres</span></div>

            <div><span className="label">Correo Electrónico:</span></div>
            <div><span className="value">toni@gmail.com</span></div>

            <div><span className="label">Contraseña:</span></div>
            <div><span className="value">**********</span></div>

            <div><span className="label">Rol:</span></div>
            <div><span className="value">normal</span></div>
        </div>
            <button className="button">Editar Información</button>
    </div>
  )
}
