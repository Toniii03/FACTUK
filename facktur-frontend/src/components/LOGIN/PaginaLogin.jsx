import { useState } from 'react';
import '../../styles/Login/Login.css';
import { MensajeErrores } from '../MensajeErrores';
import logo from "../../logo.png";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const PaginaLogin = () => {
  const navigate = useNavigate();

  const [nombreUsuario, setnombreUsuario] = useState('');
  const [password, setpassword] = useState('');
  const [error, setError] = useState('');

  const comprobarErrores = async (e) => {
    e.preventDefault();
    setError('');

    if (nombreUsuario && password) {
      try {
        const response = await axios.post(
          'http://localhost:8080/auth/login',
          {
            nombreUsuario,
            password,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        // LOGIN EXITOSO
        const { token, nombreUsuario: nameUser, nombre, email, tipo } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('tipo', tipo);
        localStorage.setItem('usuario', JSON.stringify({ nombreUsuario : nameUser, nombre, email, tipo }));
        navigate('/');

      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            setError('Credenciales incorrectas. Por favor, verifica tu Nombre de usuario y contraseña');
          } else if (error.response.status === 400) {
            setError('Por favor, verifica los datos ingresados');
          } else {
            setError(error.response.data || 'Ocurrió un error inesperado');
          }
        } else if (error.request) {
          setError('No se recibió respuesta del servidor. Intenta más tarde');
        } else {
          setError('Error en la configuración de la solicitud. Intenta más tarde');
        }
      }
    } else {
      setError("Por favor, completa todos los campos");
    }
  };

  return (
  <div className="Contenido-form">
    {error && <MensajeErrores mensaje={error} onClose={() => setError('')} />}

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
