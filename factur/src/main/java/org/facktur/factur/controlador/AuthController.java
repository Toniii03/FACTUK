package org.facktur.factur.controlador;

import java.util.Map;

import org.facktur.factur.EntidadesDTO.AuthResponse;
import org.facktur.factur.EntidadesDTO.LoginRequest;
import org.facktur.factur.EntidadesDTO.UsuarioRequest;
import org.facktur.factur.config.JwtUtil;
import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.repositorios.UsuarioRepositorio;
import org.facktur.factur.servicios.ServicioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        // Validar las credenciales usando el servicio de autenticación
        Usuario usuario = servicioUsuario.authenticate(loginRequest.getNombreUsuario(), loginRequest.getPassword());
        
        if (usuario != null) {
            // Generar el token JWT
            String token = jwtUtil.generateToken(loginRequest.getNombreUsuario());
            AuthResponse authResponse = new AuthResponse(
                token,
                usuario.getNombreUsuario(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getTipo()
            );
            return ResponseEntity.ok(authResponse);
        } else {
            return ResponseEntity.status(401).body("Credenciales invalidas");
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registrarUsuario(@RequestBody UsuarioRequest request) {
        System.out.println(request);

        if (usuarioRepositorio.existsByEmail(request.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("status", "error", "message", "El correo ya está registrado."));
        }

        if (usuarioRepositorio.existsByNombreUsuario(request.getNombreUsuario())) {
            return ResponseEntity
                    .badRequest()
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
