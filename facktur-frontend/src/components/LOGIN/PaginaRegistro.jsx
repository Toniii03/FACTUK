import React, { useState } from 'react'
import '../../styles/Login/registro.css'
import { Link, useNavigate } from 'react-router-dom'
import { MensajeErrores } from '../MensajeErrores'
import servicioUsuarios from '../SERVICIOS/ServicioUsuarios';
import { useMensajes } from '../../context/MensajesContext';





export const PaginaRegistro = () => {

  const { mostrarError, mostrarMensaje } = useMensajes();


  const { crearUsuario } = servicioUsuarios;
  const navigate = useNavigate();


  const comprobarEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const contrasenaCorreta = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[.\-_@!#$%&/=?¿¡*+~]).{8,}$/;


  const [nombre, setNombre] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [contrasena2, setContrasena2] = useState('');

  const comprobarErrores = async (e) => {
    e.preventDefault();
    mostrarError('');

    if (!nombre || !nombreUsuario || !email || !contrasena || !contrasena2) {
      mostrarError('Por favor, completa todos los campos');
      return;
    }
    if (!comprobarEmail.test(email)) {
      mostrarError('Por favor, ingresa un correo electrónico válido');
      return;
    }

    if (contrasena !== contrasena2) {
      mostrarError('Las contraseñas no coinciden');
      return;
    }

    if (!contrasenaCorreta.test(contrasena)) {
      mostrarError('La contraseña debe tener al menos:\n- 8 caracteres\n- Una letra mayúscula\n- Una letra minúscula\n- Un carácter especial (.- @ # ! $ % & / = ? ¿ +)');
      return;
    }

    const usuario = {
      nombreCompleto: nombre,
      nombreUsuario,
      email,
      contrasena,
      tipo: 'NOR',
    };

    try {
      const response = await crearUsuario(usuario);
      if (response.status === 'ok') {
        mostrarMensaje('Usuario creado exitosamente');
        navigate('/auth/login');
      } else {
        mostrarError('Error al crear el usuario. ' + response.message);
      }
    } catch (err) {
      mostrarError('Hubo un error al registrar al usuario.');
    }
  };

  return (
    <div className='contenido'>
      <div className='container' style={{maxWidth:"900px"}}>
        <h2>Registro de Usuario</h2>
        <form onSubmit={comprobarErrores}>
          <input type="text" className="input-field" placeholder="Nombre Completo" onChange={(e) => setNombre(e.target.value)}></input>
          <input type="text" className="input-field" placeholder="Nombre Usuario" onChange={(e) => setNombreUsuario(e.target.value)}></input>
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
