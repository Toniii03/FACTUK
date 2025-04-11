package org.facktur.factur.controlador;

import java.util.List;

import org.facktur.factur.EntidadesDTO.UsuarioRequest;
import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.servicios.ServicioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/registro")
public class RegistroUsuarioControlador {
	
	@Autowired
	private ServicioUsuario usuariosSistema;
	
	@PostMapping
	public ResponseEntity<?> CrearUsuarioSistema(@RequestBody UsuarioRequest usuario){		
		
		Usuario usuarioBuscado = usuariosSistema.findUsuarioByEmail(usuario.getEmail(),usuario.getNombreUsuario());
		
		if (usuarioBuscado == null ) {
			
			Usuario nuevoUsuario = new Usuario();
			nuevoUsuario.setNombre(usuario.getNombre());
			nuevoUsuario.setNombreUsuario(usuario.getNombreUsuario());
			nuevoUsuario.setEmail(usuario.getEmail());
			nuevoUsuario.setContrasena(usuario.getContrasena());
			nuevoUsuario.setTipo("NORMAL");
			
			usuariosSistema.crearCliente(nuevoUsuario);
			
			return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
		}else{
			 return ResponseEntity.status(HttpStatus.CONFLICT).body("El usuario ya existe con ese email");
		}
	}	
}
