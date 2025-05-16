package org.facktur.factur.EntidadesDTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {
	private Long id;
    private String nombreUsuario;
    private String nombre;
    private String email;
    private String tipo;
}
