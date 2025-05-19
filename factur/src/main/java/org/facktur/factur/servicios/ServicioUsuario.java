package org.facktur.factur.servicios;

import java.util.List;
import java.util.Optional;

import org.facktur.factur.EntidadesDTO.usuarioDtoRequest;
import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class ServicioUsuario implements UserDetailsService {

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepositorio.findByNombreUsuario(username);
        if (usuario == null) {
            throw new UsernameNotFoundException("Usuario no encontrado");
        }
        return usuario;
    }

    public List<Usuario> findAllUsuarios() {
        return usuarioRepositorio.findAll();
    }

    public Optional<Usuario> findUsuarioByID(Long id) {
        return usuarioRepositorio.findById(id);
    }

    public Usuario crearCliente(Usuario usuario) {
        return usuarioRepositorio.save(usuario);
    }

    public List<Usuario> findAll() {
        return usuarioRepositorio.findAll();
    }
    
    public usuarioDtoRequest convertirAUsuarioDTO(Usuario usuario) {
        return new usuarioDtoRequest(
            usuario.getNombreUsuario(),
            usuario.getNombre(),
            usuario.getEmail(),
            usuario.getTipo()
        );
    }

	public usuarioDtoRequest updateUsuario(Long id, usuarioDtoRequest usuarioRequest) {
		
		Usuario usuario = usuarioRepositorio.findById(id)
				.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
		
		usuario.setNombreUsuario(usuarioRequest.getNombreUsuario());
		usuario.setNombre(usuarioRequest.getNombre());
		usuario.setEmail(usuarioRequest.getEmail());
		usuario.setTipo(usuarioRequest.getTipo());
		
		System.out.println("USUARIO A MODIFICAAAAAR" + usuario);
		
		Usuario actualizado = usuarioRepositorio.save(usuario);
		
		return convertirAUsuarioDTO(actualizado);
	}
}
