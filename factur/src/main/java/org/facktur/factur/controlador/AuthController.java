package org.facktur.factur.controlador;

import java.util.Map;

import org.facktur.factur.EntidadesDTO.LoginRequest;
import org.facktur.factur.EntidadesDTO.UsuarioRequest;
import org.facktur.factur.config.JwtUtil;
import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.repositorios.UsuarioRepositorio;
import org.facktur.factur.servicios.ServicioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ServicioUsuario servicioUsuario;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getNombreUsuario(), request.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciales inválidas");
        }

        String token = jwtUtil.generateToken(request.getNombreUsuario());

        ResponseCookie cookie = ResponseCookie.from("AUTH_TOKEN", token)
            .httpOnly(true)
            .secure(false) // Cambia a true en producción con HTTPS
            .path("/")
            .maxAge(60 * 60) // 1 hora
            .sameSite("Lax")
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(Map.of("status", "ok", "message", "Login exitoso"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("AUTH_TOKEN", "")
            .httpOnly(true)
            .secure(false)
            .path("/")
            .maxAge(0) // Eliminar cookie
            .sameSite("Lax")
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(Map.of("status", "ok", "message", "Sesión cerrada"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioRequest request) {

        if (usuarioRepositorio.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", "El correo ya está registrado."));
        }

        if (usuarioRepositorio.existsByNombreUsuario(request.getNombreUsuario())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("status", "error", "message", "El nombre de usuario ya está en uso."));
        }

        Usuario usuario = new Usuario();
        usuario.setNombreUsuario(request.getNombreUsuario());
        usuario.setNombre(request.getNombreCompleto());
        usuario.setEmail(request.getEmail());
        usuario.setTipo(request.getTipo());
        usuario.setContrasena(passwordEncoder.encode(request.getContrasena()));

        usuarioRepositorio.save(usuario);

        return ResponseEntity.ok(Map.of("status", "ok", "message", "Usuario registrado correctamente"));
    }
}
