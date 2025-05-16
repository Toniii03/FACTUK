package org.facktur.factur.controlador;

import java.util.Map;

import org.facktur.factur.EntidadesDTO.AuthResponse;
import org.facktur.factur.EntidadesDTO.LoginRequest;
import org.facktur.factur.EntidadesDTO.UsuarioRequest;
import org.facktur.factur.config.JwtUtil;
import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioRepositorio usuarioRepositorio;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getNombreUsuario(), request.getPassword())
            );
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Credenciales inválidas"));
        }
        
        Usuario user = usuarioRepositorio.findByNombreUsuario(request.getNombreUsuario());
        AuthResponse usuario = new AuthResponse(user.getId(),user.getNombreUsuario(),user.getNombre(),user.getEmail(),user.getTipo());
        		
        String token = jwtUtil.generateToken(request.getNombreUsuario());

        ResponseCookie cookie = ResponseCookie.from("AUTH_TOKEN", token)
            .httpOnly(true)
            .secure(false)  // Cambia a true en producción con HTTPS
            .path("/")
            .maxAge(60 * 60) // 1 hora
            .sameSite("Lax")
            .build();
        
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(Map.of("token", token, "tipo", usuario.getTipo(),"usuario",usuario ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("AUTH_TOKEN", "")
            .httpOnly(true)
            .secure(false)
            .path("/")
            .maxAge(0)  // Elimina cookie
            .sameSite("Lax")
            .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok(Map.of("message", "Sesión cerrada"));
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioRequest request) {
        boolean emailExiste = usuarioRepositorio.existsByEmail(request.getEmail());
        boolean usuarioExiste = usuarioRepositorio.existsByNombreUsuario(request.getNombreUsuario());

        if (emailExiste || usuarioExiste) {
            StringBuilder errorMessage = new StringBuilder();

            if (emailExiste) {
                errorMessage.append("El correo ya está registrado. ");
            }

            if (usuarioExiste) {
                errorMessage.append("El nombre de usuario ya está en uso.");
            }

            return ResponseEntity
                    .badRequest()
                    .body(Map.of("status", "error", "message", errorMessage.toString().trim()));
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
    
    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(HttpServletRequest request) {
        String token = jwtUtil.getTokenFromCookies(request);

        if (token == null || !jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "No autenticado"));
        }

        String username = jwtUtil.getUsernameFromToken(token);
        Usuario usuario = usuarioRepositorio.findByNombreUsuario(username);

        return ResponseEntity.ok(Map.of(
            "nombreUsuario", usuario.getNombreUsuario(),
            "nombre", usuario.getNombre(),
            "email", usuario.getEmail(),
            "tipo", usuario.getTipo()
        ));
    }
}
