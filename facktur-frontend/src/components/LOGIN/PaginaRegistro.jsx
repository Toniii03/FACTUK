import React, { useState } from 'react'
import '../../styles/Login/registro.css'
import { Link } from 'react-router-dom'
import { MensajeErrores } from '../MensajeErrores'
import { usuarioRequest } from '../../Modelos/usuarioRequest'
import axios from 'axios'

export const PaginaRegistro = () => {
  const comprobarEmail= /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const contrasenaCorreta = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[.\-_@!#$%&/=?¿¡*+~]).{8,}$/

  const [nombre,setNombre] = useState('');
  const [nombreUsuario,setNombreUsuarip] = useState('');
  const [email,setEmail] = useState('');
  const [contrasena1,setContrasena1] = useState('');
  const [contrasean2,setContrasena2] = useState('');

  const [error, setError] = useState('');

  const comprobarErrores = (e) => {
    e.preventDefault()
    setError('');

    if (nombre && nombreUsuario && email && contrasena1 && contrasean2) {
      if (comprobarEmail.test(email)){
        if (contrasena1 === contrasean2) {
          if(contrasenaCorreta.test(contrasena1)){
          /**
           * hacer Post del formulario hacia el backend
           */
          const usuario = new usuarioRequest(nombreUsuario, nombre, email, contrasena1, 'usuario');
          axios.post('http://localhost:8080/registrar', usuario)
          console.log('Formulario enviado correctamente');
          
          }else{
            setError("La contraseña debe tener al menos:\n- 8 caracteres\n- Una letra mayúscula\n- Una letra minúscula\n- Un carácter especial (.- @ # ! $ % & / = ? ¿ +)");
            return;
          }
        }else{
          setError("Las contraseñas no coinciden");
          return;
        }
      }else{
        setError('Por favor, ingresa un correo electrónico válido');
        return;
      }
    }else{
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
              <input type="text" class="input-field" placeholder="Nombre Completo" onChange={(e) => setNombre(e.target.value)}></input>
              <input type="text"  class="input-field" placeholder="Nombre Usuario" onChange={(e) => setNombreUsuarip(e.target.value)}></input>
              <input type="email" class="input-field" placeholder="Correo electrónico" onChange={(e) => setEmail(e.target.value)}></input>
              <input type="password" class="input-field" placeholder="Contraseña" onChange={(e) => setContrasena1(e.target.value)}></input>
              <input type="password" class="input-field" placeholder="Confirmar contraseña" onChange={(e) => setContrasena2(e.target.value)}></input>
              <button type="submit" class="submit-btn">Registrar</button>
          </form>

          <div class="footer">
              <p>¿Ya tienes cuenta? <Link to="/auth/login">Inicia sesión</Link></p>
          </div>
      </div>
    </div>
  )
}
