import React, { useState, useEffect } from 'react'
import "../../styles/paginas/paginaInfoUsuario.css"

const DEFAULT_DATA = {}

export const PaginaInfoUsuario = () => {
  const [editando, setEditando] = useState(false)

  const [usuario, setUsuario] = useState(DEFAULT_DATA)

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario")
    if (usuarioGuardado) {
    setUsuario(JSON.parse(usuarioGuardado))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setUsuario((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditar = () => {
    setEditando(true)
  }

  const handleGuardar = () => {
    setEditando(false)
    console.log("Datos guardados:", usuario)
    // petición para actualizar el usuario en el backend
  }

  return (
    <div className="contenedor-principal">

      <div className='div-estrutura-info-usuario'>
        <div className="user-info">
          <form className="formulario-usuario">
            <div>
              <span className="label">Nombre de Usuario:</span>
              <input type="text" name="nombreUsuario" className="input-datos" value={usuario.nombreUsuario} onChange={handleChange} readOnly={!editando} />
            </div>

            <div>
              <span className="label">Nombre:</span>
              <input type="text" name="nombre" className="input-datos" value={usuario.nombre} onChange={handleChange} readOnly={!editando} />
            </div>

            <div>
              <span className="label">Correo Electrónico:</span>
              <input type="text" name="email" className="input-datos" value={usuario.email} onChange={handleChange} readOnly={!editando} />
            </div>

            <div>
              <span className="label">Rol:</span>
              <input type="text" name="tipo" className="input-datos" value={usuario.tipo} readOnly />
            </div>

            <div className="botones">
              {!editando ? (
                <button type="button" className="button" onClick={handleEditar}>Editar Información</button>
              ) : (
                <button type="button" className="btnGuardarCambios" onClick={handleGuardar}>Guardar Cambios</button>
              )}
            </div>
          </form>
        </div>

        <div className='div-recuperarContraseña'>
          <h3>¿Has olvidado tu contraseña?</h3>
          <p>
            No te preocupes, es algo común. Puedes restablecer tu contraseña fácilmente haciendo clic en el siguiente enlace. 
            Asegúrate de tener acceso al correo electrónico con el que registraste tu cuenta.
          </p>
          <a href="/recuperar-contraseña" className="enlace-recuperar">
            Recuperar Contraseña
          </a>
        </div>

      </div> 
    </div>
  )
}
