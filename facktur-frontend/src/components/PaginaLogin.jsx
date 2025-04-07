import { useState } from 'react';
import '../styles/Login.css';
import { MensajeErrores } from './MensajeErrores';
import 'bootstrap/dist/css/bootstrap.min.css';

export const PaginaLogin = () => {
  const comprobarEmail= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const [email, setEmail] = useState('');
  const [contrasena1, setContrasena1] = useState('');
  const [contrasena2, setContrasena2] = useState('');
  const [error, setError] = useState('');

  const comprobarErrores = (e) => {
    e.preventDefault()

    setError('');

    if (email && contrasena1 && contrasena2) {
        if(comprobarEmail.test(email)){
          if (contrasena1 == contrasena2) {
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

      <div className="form">
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
                id='contrasena1'
                className="Input-Form-Login"
                type="password"
                value={contrasena1}
                onChange={(e) => setContrasena1(e.target.value)}
                placeholder="Contraseña"
                pattern=".*"
              />
            </div>

            <div className='fila-form'>
              <input
                id='contrasena2'
                type="password"
                value={contrasena2}
                onChange={(e) => setContrasena2(e.target.value)}
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
  );
};
