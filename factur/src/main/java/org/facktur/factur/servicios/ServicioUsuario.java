package org.facktur.factur.servicios;

import java.util.List;

import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Service;

@Service
public class ServicioUsuario {
	
	@Autowired
	private UsuarioRepositorio usuarioRepositorio;
	
	
	public void newUsuario() {
		
	}
	
	public List<Usuario> findAllUsuarios() {
		return this.usuarioRepositorio.findAll();
		
	}

	public Usuario newUsuario(Usuario usuario) {
		return this.usuarioRepositorio.save(usuario);
	}

}
