package org.facktur.factur.EntidadesDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String nombreUsuario;
    private String password;
}
