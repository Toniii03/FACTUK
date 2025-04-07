package org.facktur.factur.controlador;

import java.net.URI;
import java.util.List;

import org.facktur.factur.config.AppSettings;
import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.servicios.ServicioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = AppSettings.URL_CROOS_ORIGIN) //Configuracion en AppSettings
public class ControladorAutentificacion {
	
	@Autowired
	private ServicioUsuario servicioUsuario;
	
    @GetMapping("/login")
    public ResponseEntity<String> loginPage() {
        // Aquí no estamos haciendo autenticación, solo mostrando un mensaje
        return ResponseEntity.ok("Vista de login cargada");
    }

}
