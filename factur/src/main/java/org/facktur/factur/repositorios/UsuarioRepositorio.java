package org.facktur.factur.repositorios;

import java.util.Optional;

import org.facktur.factur.modelos.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface UsuarioRepositorio extends JpaRepository<Usuario, Long>{
	
	//Metodos de CRUD creado automaticamente por JpaRepository
	
	//Busca un usuario por su nombre e usuario y lo devuelve
	Optional<Usuario> findByNombreUsuario(String nombreUsuario);

}
