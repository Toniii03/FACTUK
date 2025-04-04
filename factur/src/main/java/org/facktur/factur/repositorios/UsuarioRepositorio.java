package org.facktur.factur.repositorios;

import java.util.Optional;

import org.facktur.factur.entidades.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsuarioRepositorio extends JpaRepository<Usuario, Long>{

	Object findByNombreUsuario(String username);

}
