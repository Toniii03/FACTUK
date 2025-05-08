package org.facktur.factur.servicios;

import java.util.List;
import java.util.Optional;

import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ResponseStatus;

@Service
public class ServicioUsuario {
	
	@Autowired
	private UsuarioRepositorio usuarioRepositorio;	

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Validar las credenciales de usuario por nombre de usuario y contraseña
    public Usuario authenticate(String nombreUsuario, String contrasena) {
        Usuario usuario = usuarioRepositorio.findByNombreUsuario(nombreUsuario);
        if (usuario != null && passwordEncoder.matches(contrasena, usuario.getContrasena())) {
            return usuario; // Devolver el usuario si las credenciales son correctas
        }
        return null; // Si el usuario no existe o la contraseña no coincide
    }
	
	public List<Usuario> findAllUsuarios() {
		return this.usuarioRepositorio.findAll();	
	}
	
	public Optional<Usuario> findUsuariByID(Long id) {
		return this.usuarioRepositorio.findById(id);
	}
	

	public Usuario crearCliente(Usuario usuario) {
		return this.usuarioRepositorio.save(usuario);
	}

	public List<Usuario> findAll() {
		return this.usuarioRepositorio.findAll();
	}

}
