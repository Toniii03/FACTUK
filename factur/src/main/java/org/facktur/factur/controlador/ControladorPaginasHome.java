package org.facktur.factur.controlador;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class ControladorPaginasHome {
	
	@GetMapping("/home")
	public String homePagge() {
		return "home";
	}

}
