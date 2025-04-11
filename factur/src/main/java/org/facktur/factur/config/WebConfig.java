package org.facktur.factur.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	 @Override
	    public void addCorsMappings(CorsRegistry registry) {
	        registry.addMapping("/**")  // Permite CORS para todas las rutas
	                .allowedOrigins("http://localhost:3000")  // Permite solicitudes desde localhost:3000 (tu frontend)
	                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Permite estos métodos
	                .allowedHeaders("*")  // Permite todos los encabezados
	                .allowCredentials(true);  // Permite credenciales (cookies, autenticación)
	    }
}
