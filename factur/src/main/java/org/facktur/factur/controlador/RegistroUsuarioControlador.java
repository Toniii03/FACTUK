package org.facktur.factur.controlador;

import org.facktur.factur.EntidadesDTO.UsuarioRequest;
import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.servicios.ServicioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.RequestEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/register")
public class RegistroUsuarioControlador {
	
	@Autowired
	private ServicioUsuario usuariosSistema;
	
	public RequestEntity<Usuario> CrearUsuarioSistema(@RequestBody UsuarioRequest usuario){
		
		Usuario usuarioBuscado = usuariosSistema.findUsuarioByEmail(usuario.getEmail());
		
		//Seguir Comprobaciones
		return null;
	}
	
}
