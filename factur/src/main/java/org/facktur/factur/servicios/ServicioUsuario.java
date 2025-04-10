package org.facktur.factur.servicios;

import java.util.List;
import java.util.Optional;

import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

@Service
public class ServicioUsuario {
	
	@Autowired
	private UsuarioRepositorio usuarioRepositorio;
	
	public List<Usuario> findAllUsuarios() {
		return this.usuarioRepositorio.findAll();	
	}
	
	public Optional<Usuario> findUsuariByID(Long id) {
		return this.usuarioRepositorio.findById(id);
	}
	
	public Usuario findUsuarioByEmail(String email, String nombreUsuario) {
		 return this.usuarioRepositorio.findUsuarioByEmail(email)
		            .orElseGet(() -> this.usuarioRepositorio.findByNombreUsuario(nombreUsuario).orElse(null));
	}

	public Usuario crearCliente(Usuario usuario) {
		return this.usuarioRepositorio.save(usuario);
	}

	public List<Usuario> findAll() {
		return this.usuarioRepositorio.findAll();
	}

}
