import React, { useState } from 'react'
import '../../styles/Login/registro.css'
import { Link } from 'react-router-dom'
import { MensajeErrores } from '../MensajeErrores'
import { usuarioRequest } from '../../Modelos/usuarioRequest'
import axios from 'axios'

// Función para obtener el token CSRF desde las cookies
const obtenerCsrfToken = () => {
  return document.cookie.split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith('XSRF-TOKEN'))
    ?.split('=')[1];
};

export const PaginaRegistro = () => {
  const comprobarEmail= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const contrasenaCorreta = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[.\-_@!#$%&/=?¿¡*+~]).{8,}$/

  const [nombre,setNombre] = useState('');
  const [nombreUsuario,setNombreUsuarip] = useState('');
  const [email,setEmail] = useState('');
  const [contrasena,setContrasena] = useState('');
  const [contrasena2,setContrasena2] = useState('');

  const [error, setError] = useState('');

  const comprobarErrores = (e) => {
    e.preventDefault()
    setError('');

    if (nombre && nombreUsuario && email && contrasena && contrasena2) {
      if (comprobarEmail.test(email)){
        if (contrasena === contrasena2) {
          if(contrasenaCorreta.test(contrasena)){
          /**
           * hacer Post del formulario hacia el backend
           */
          const usuario = new usuarioRequest(nombreUsuario, nombre, email, contrasena, 'NORMAL');

          console.log(usuario.toString());

          // Obtener el token CSRF
          const csrfToken = obtenerCsrfToken();
          if (!csrfToken) {
            setError('No se pudo encontrar el token CSRF');
            return;
          }
          console.log("Token CSRF encontrado: " + csrfToken);
          
          // Enviar la solicitud POST con Axios incluyendo el token CSRF

          axios.post('http://localhost:8081/registro', usuario, {
            headers: {
              'Content-Type': 'application/json',
              'X-XSRF-TOKEN': csrfToken // Incluir el token CSRF en las cabeceras
            }
          })
            .then(response => {
              console.log('Usuario creado:', response.data);
              // Código después de la creación del usuario
            })
            .catch(error => {
              console.error('Error al registrar usuario:', error);
            });

          console.log('Formulario enviado correctamente');
          } else {
            setError("La contraseña debe tener al menos:\n- 8 caracteres\n- Una letra mayúscula\n- Una letra minúscula\n- Un carácter especial (.- @ # ! $ % & / = ? ¿ +)");
            return;
          }
        } else {
          setError("Las contraseñas no coinciden");
          return;
        }
      } else {
        setError('Por favor, ingresa un correo electrónico válido');
        return;
      }
    } else {
      setError('Por favor, completa todos los campos');
      return;
    }
  }

  return (
    <div className='contenido'>
      <div>
        {error && <MensajeErrores mensaje={error} onClose={() => setError('')} />}
      </div>
      <div className='container'>
        <h2>Registro de Usuario</h2>
        <form onSubmit={comprobarErrores}>
          <input type="text" className="input-field" placeholder="Nombre Completo" onChange={(e) => setNombre(e.target.value)}></input>
          <input type="text" className="input-field" placeholder="Nombre Usuario" onChange={(e) => setNombreUsuarip(e.target.value)}></input>
          <input type="email" className="input-field" placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)}></input>
          <input type="password" className="input-field" placeholder="Contraseña" onChange={(e) => setContrasena(e.target.value)}></input>
          <input type="password" className="input-field" placeholder="Confirmar contraseña" onChange={(e) => setContrasena2(e.target.value)}></input>
          <button type="submit" className="submit-btn">Registrar</button>
        </form>

        <div className="footer">
          <p>¿Ya tienes cuenta? <Link to="/auth/login">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  )
}
