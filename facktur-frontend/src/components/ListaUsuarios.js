import React,{ useEffect, useState } from 'react'
import servicioListarUsuarios from '../services/servicioListarUsuarios'

export const ListaUsuarios = () => {

    const [usuarios,setUsuarios] = useState([])

    useEffect( () => {
        servicioListarUsuarios.ObtenerTodosUsuarios().then( response => {
            setUsuarios(response.data);
        }
        ).catch(error => {
            console.log(error);
        })
    },[])

  return (
    <div className='contenedor-lista'>
    <h2>Lista empleados</h2>
    <ul >
    {
      usuarios.map( usuario =>
        <li key={usuario.id}>Nombre: {usuario.nombre}, Email:  {usuario.email}</li>
      )
    }
    </ul>

  </div>
  )
}
