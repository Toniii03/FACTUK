import React, { useState, useEffect } from 'react'
import "../../styles/paginas/paginaInfoUsuario.css"
import SelectorMoneda from '../COMPONENTES/SelectorMoneda'
import { useMoneda } from '../COMPONENTES/MonedaContext'
import axios from 'axios';
import servicioUsuarios from "../SERVICIOS/ServicioUsuarios";
import { useMensajes } from '../../context/MensajesContext';


export const PaginaInfoUsuario = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [editando, setEditando] = useState(false)
  const { moneda } = useMoneda();
  const { mostrarError, mostrarMensaje } = useMensajes();
  const [cargando, setCargando] = useState(false);

  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const email = JSON.parse(localStorage.getItem("usuario"))?.email;

  const [usuario, setUsuario] = useState({ nombre: "" });

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

  const handleGuardar = async () => {
    try {
      await servicioUsuarios.ActualizarUsuarioLogueado(usuario);
      mostrarMensaje("Datos actualizados correctamente");
      localStorage.setItem("usuario", JSON.stringify(usuario));
      setEditando(false);
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      mostrarError("Error al guardar los cambios");
    }
  };

  const handleRecuperar = async () => {
    setCargando(true);
    try {
      const url = `${API_URL}auth/obtener-password`;
      await axios.post(url,
        null,
        {
          params: { email },
          withCredentials: true,
        }
      );
      mostrarMensaje("Mensaje de recuperación enviado");
    } catch (error) {
      mostrarError("Error al enviar el correo de recuperación");
    } finally {
      setCargando(false);
    }
  };


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

          <div style={{ padding: "1rem 0rem" }}>
            <div>
              <SelectorMoneda />
              <p>Moneda seleccionada: {moneda}</p>
            </div>

          </div>

        </div>

        <div className="div-recuperarContraseña">
          <h3>¿Has olvidado tu contraseña?</h3>
          <p>
            No te preocupes, es algo común. Puedes restablecer tu contraseña fácilmente haciendo clic en el siguiente enlace.
            Asegúrate de tener acceso al correo electrónico con el que registraste tu cuenta.
          </p>
          <button
            onClick={handleRecuperar}
            className="enlace-recuperar"
            style={{ border: "none" }}
            disabled={cargando}
          >
            {cargando ? "Enviando..." : "Enviar correo de recuperación"}
          </button>


          {mensaje && <p className="mensaje-exito">{mensaje}</p>}
          {error && <p className="mensaje-error">{error}</p>}
        </div>

      </div>
    </div>
  )
}
