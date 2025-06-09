package org.facktur.factur.controlador;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.facktur.factur.EntidadesDTO.AuthResponse;
import org.facktur.factur.EntidadesDTO.CambioPasswordRequest;
import org.facktur.factur.EntidadesDTO.LoginRequest;
import org.facktur.factur.EntidadesDTO.UsuarioRequest;
import org.facktur.factur.EntidadesDTO.usuarioDtoRequest;
import org.facktur.factur.config.JwtUtil;
import org.facktur.factur.entidades.PasswordResetToken;
import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.repositorios.PasswordResetTokenRepository;
import org.facktur.factur.repositorios.UsuarioRepositorio;
import org.facktur.factur.servicios.PasswordResetEncoderService;
import org.facktur.factur.servicios.ServicioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    private PasswordResetEncoderService passwordResetService;
    
    @Autowired
    private ServicioUsuario servicioUsuario;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    AuthController(ServicioUsuario servicioUsuario) {
        this.servicioUsuario = servicioUsuario;
    }

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
            .secure(true)  // Cambia a true en producción con HTTPS
            .path("/")
            .maxAge(60 * 60 * 24) // 24 horas
            .sameSite("None")
            .build();
        
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(Map.of("token", token, "tipo", usuario.getTipo(),"usuario",usuario ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("AUTH_TOKEN", "")
            .httpOnly(true)
            .secure(true)
            .path("/")
            .maxAge(0)
            .sameSite("None")
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
    
    @GetMapping("/usuarios")
    public List<Usuario> listadoUsuarios() {
    	return servicioUsuario.findAll();	
    }
    
    @GetMapping("/tipo-usuario")
    public ResponseEntity<?> tipoUsuario() {
    	 String tipoUsuario = servicioUsuario.findTipoUsuarioActual();

         if (tipoUsuario == null) {
             return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario no autenticado");
         }

         return ResponseEntity.ok(Map.of("tipo", tipoUsuario));
    }
    
    @GetMapping("/usuarios/{id}")
    public Optional<Usuario> buscarUsuarioPorID(@PathVariable Long id){
    	Optional<Usuario> usuario = servicioUsuario.findUsuarioByID(id);
		return usuario;
    		
    }
    
    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id){
    	try {
	    	servicioUsuario.eliminarUsuario(id);
	    	return ResponseEntity.ok(Map.of("status", "ok", "message", "Usuario eliminado correctamente"));
    	}catch (Exception e) {
			return ResponseEntity.ok(Map.of("status", "error", "message", "No se ha podido eliminar el usuario"));
		}
    }
    
    @PutMapping("/usuario/{id}")
    public ResponseEntity<?> actualizarUsuario(@RequestBody usuarioDtoRequest usuarioRequest, @PathVariable Long id){
    	try {
        	usuarioDtoRequest usuario = servicioUsuario.updateUsuario(id,usuarioRequest);
        	if (usuario != null) {
            	return ResponseEntity.ok(Map.of("status", "ok", "message", "Usuario Actualizado correctamente"));
        	}else {
        		return ResponseEntity.ok(Map.of("status", "error", "message", "No se ha encontrado el usuario"));
        	}
		} catch (Exception e) {
			return ResponseEntity.ok(Map.of("status", "error", "message", e));
		} 			
    }
    
    @PutMapping("/usuarioLogueado/{id}")
    public ResponseEntity<?> actualizarUsuarioLogueado(@RequestBody usuarioDtoRequest usuarioRequest, @PathVariable Long id){
    	try {
        	usuarioDtoRequest usuario = servicioUsuario.updateUsuario(id,usuarioRequest);
        	if (usuario != null) {
            	return ResponseEntity.ok(Map.of("status", "ok", "message", "Usuario Actualizado correctamente"));
        	}else {
        		return ResponseEntity.ok(Map.of("status", "error", "message", "No se ha encontrado el usuario"));
        	}
		} catch (Exception e) {
			return ResponseEntity.ok(Map.of("status", "error", "message", e));
		} 			
    }
    
    @PutMapping("/usuarios/{idUsuario}/cambiar-password")
    public ResponseEntity<?> cambiarPassUser(@PathVariable("idUsuario") Long id, @RequestBody CambioPasswordRequest request) {
        try {
        	System.out.println(request.getNuevaContrasena());
            Usuario usuario = servicioUsuario.cambiosDePassword(id, request);
            if (usuario != null) {
                return ResponseEntity.ok(Map.of("status", "ok", "message", "Usuario actualizado correctamente"));
            } else {
                return ResponseEntity.ok(Map.of("status", "error", "message", "No se ha encontrado el usuario"));
            }
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("status", "error", "message", "ERROR AL GUARDAR LA PASSWORD"));
        }
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
    
    @PostMapping("/obtener-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
       Usuario usuario = usuarioRepositorio.findByEmail(email)
                .orElse(null);

       if (usuario == null) {
          return ResponseEntity.badRequest().body("No existe un usuario con ese correo.");
       }

       String token = passwordResetService.createPasswordResetToken(usuario);
       passwordResetService.sendPasswordResetEmail(email, token);

       return ResponseEntity.ok("Correo de recuperación enviado.");
        
    }
        
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if (token == null || newPassword == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Faltan parámetros"));
        }

        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token);
        if (resetToken == null || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Token inválido o expirado."));
        }

        Usuario usuario = resetToken.getUsuario();
        usuario.setContrasena(new BCryptPasswordEncoder().encode(newPassword));
        usuarioRepositorio.save(usuario);
        passwordResetTokenRepository.delete(resetToken);
        System.out.println("Respuesta enviada: " + Map.of("message", "Contraseña actualizada correctamente."));
        return ResponseEntity.ok(Map.of("message", "Contraseña actualizada correctamente."));
    }      
}
