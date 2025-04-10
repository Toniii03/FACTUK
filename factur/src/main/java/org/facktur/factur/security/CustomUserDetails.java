package org.facktur.factur.security;

import org.facktur.factur.entidades.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

public class CustomUserDetails implements UserDetails {

    private final Usuario usuario;

    public CustomUserDetails(Optional<Usuario> usuario2) {
        // Verificamos si el Optional contiene un valor, en caso contrario lanzamos una excepción o manejamos el caso adecuadamente
        this.usuario = usuario2.orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Utilizamos el campo "tipo" como rol. Ejemplo: "ADMIN", "NORMAL"
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + usuario.getTipo()));
    }

    @Override
    public String getPassword() {
        return usuario.getContrasena();
    }

    @Override
    public String getUsername() {
        return usuario.getNombreUsuario();
    }

    public String getEmail() {
        return usuario.getEmail();
    }

    public String getNombreCompleto() {
        return usuario.getNombre();
    }

    public String getTipo() {
        return usuario.getTipo();
    }
}
