package org.facktur.factur.entidades;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "Usuario")
public class Usuario implements UserDetails { 

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre_usuario", unique = true, nullable = false, length = 50)
    private String nombreUsuario;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "contrasena", nullable = false, length = 255)
    private String contrasena;

    @Column(name = "tipo", nullable = false, length = 10)
    private String tipo;

    // Implementación de UserDetails

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> "ROLE_" + tipo.toUpperCase());
    }

    @Override
    public String getPassword() {
        return this.contrasena;
    }

    @Override
    public String getUsername() {
        return this.nombreUsuario;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // o lógica propia si tienes
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // o lógica propia
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // o lógica propia
    }

    @Override
    public boolean isEnabled() {
        return true; // o lógica propia
    }
}
