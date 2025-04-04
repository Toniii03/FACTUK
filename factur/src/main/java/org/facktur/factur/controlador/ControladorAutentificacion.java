package org.facktur.factur.controlador;

import java.util.List;

import org.facktur.factur.config.AppSettings;
import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.servicios.ServicioUsuario;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = AppSettings.URL_CROOS_ORIGIN) //Configuracion en AppSettings
public class ControladorAutentificacion {
	
	private ServicioUsuario servicioUsuario;
	
    @GetMapping("/login")
    public List<Usuario> loginPage() {
    	return servicioUsuario.findAllUsuarios();
    }

}
