import { useState } from 'react';
import '../../styles/Login/Login.css';
import logo from "../../logo.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import servicioUsuarios from '../SERVICIOS/ServicioUsuarios';
import { useMensajes } from '../../context/MensajesContext';

export const PaginaLogin = () => {
  const { mostrarError, mostrarMensaje } = useMensajes();

  const navigate = useNavigate();
  const { login } = servicioUsuarios;

  const [nombreUsuario, setnombreUsuario] = useState('');
  const [password, setpassword] = useState('');

  const comprobarErrores = async (e) => {
    e.preventDefault();
    mostrarError('');

    if (nombreUsuario && password) {
      const result = await login(nombreUsuario, password);

      if (result.status === 'ok') {
        mostrarMensaje("¡inicio de sesion Correcto!");
        navigate('/');
      } else {
        mostrarError("Compruebe que el usuario y la contraseña son correctos");
      }
    } else {
      mostrarError("Por favor, completa todos los campos");
    }
  };

  return (
    <div className="Contenido-form">

      <div className="form d-flex">
        {/* Columna 1: Logo */}
        <div className="columna-logo d-flex justify-content-center align-items-center">
          <img src={logo} alt="Logo" className="logo-imagen" />
        </div>

        {/* Columna 2: Formulario */}
        <div className="columna-form">
          <h2>Inicio de Sesion</h2>
          <form onSubmit={comprobarErrores}>
            <div className='cuerpo-form'>

              <div className='fila-form'>
                <input
                  id='nombreUsuario'
                  className="Input-Form-Login"
                  type="text"
                  value={nombreUsuario}
                  onChange={(e) => setnombreUsuario(e.target.value)}
                  placeholder="Correo electrónico"
                />
              </div>

              <div className='fila-form'>
                <input
                  id='password'
                  className="Input-Form-Login"
                  type="password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  placeholder="Contraseña"
                  pattern=".*"
                />
              </div>
              <div>
                ¿No tienes cuenta? <Link className='enlace' to={"/auth/register"}>Crear cuenta</Link>
              </div>

              <div className='fila-form'>
                <button type="submit" className="boton-submit">
                  Entrar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
