package org.facktur.factur.servicios;

import java.util.List;
import java.util.Optional;

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
}
