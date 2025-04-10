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
	
	public Usuario findUsuarioByEmail(String email) {
		Optional<Usuario> optionalUsuario = this.usuarioRepositorio.findUsuarioByEmail(email);
		
	    if (optionalUsuario.isPresent()) {
	        return optionalUsuario.get();
	    } else {
	        throw new RuntimeException("Usuario no encontrado con ese email"); // O el tipo de excepción que prefieras
	    }
	}

	public Usuario crearCliente(Usuario usuario) {
		return this.usuarioRepositorio.save(usuario);
	}

	public List<Usuario> findAll() {
		return this.usuarioRepositorio.findAll();
	}

}
