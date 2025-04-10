package org.facktur.factur.repositorios;

import java.util.List;
import java.util.Optional;

import org.facktur.factur.entidades.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long>{

	public Optional<Usuario> findByNombreUsuario(String username);
	
	public Optional<Usuario> findUsuarioByEmail(String email);

}
