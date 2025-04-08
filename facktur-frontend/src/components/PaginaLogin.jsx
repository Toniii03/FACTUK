import { useState } from 'react';
import '../styles/Login/Login.css';
import { MensajeErrores } from './MensajeErrores';
import logo from '../logo.svg'
import 'bootstrap/dist/css/bootstrap.min.css';

export const PaginaLogin = () => {
  const comprobarEmail= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const [email, setEmail] = useState('');
  const [password1, setpassword1] = useState('');
  const [password2, setpassword2] = useState('');
  const [error, setError] = useState('');

  const comprobarErrores = (e) => {
    e.preventDefault()

    setError('');

    if (email && password1 && password2) {
        if(comprobarEmail.test(email)){
          if (password1 === password2) {
            /**
             * hacer Post del formulario
             */
            console.log('Formulario enviado correctamente');
          }else{
            setError("Las contraseñas no coinciden.");
            return;
          }
        }else{
          setError("Por favor, ingresa un correo electrónico válido.");
          return;
        }
    }else{
      setError("Por favor, completa todos los campos.");
      return;
    }
    setError(""); 
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
                id='correoUsuario'
                className="Input-Form-Login"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo electrónico"
              />
            </div>

            <div className='fila-form'>
              <input
                id='password1'
                className="Input-Form-Login"
                type="password"
                value={password1}
                onChange={(e) => setpassword1(e.target.value)}
                placeholder="Contraseña"
                pattern=".*"
              />
            </div>

            <div className='fila-form'>
              <input
                id='password2'
                type="password"
                value={password2}
                onChange={(e) => setpassword2(e.target.value)}
                placeholder="Repite la contraseña"
                className="Input-Form-Login"
              />
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
