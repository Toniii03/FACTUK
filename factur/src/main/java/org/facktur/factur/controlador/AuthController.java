package org.facktur.factur.controlador;

import org.facktur.factur.EntidadesDTO.AuthResponse;
import org.facktur.factur.EntidadesDTO.LoginRequest;
import org.facktur.factur.config.JwtUtil;
import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.servicios.ServicioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}
