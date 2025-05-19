package org.facktur.factur.EntidadesDTO;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class usuarioDtoRequest {
    private String nombreUsuario;
    private String nombre;
    private String email;
    private String tipo;
}
