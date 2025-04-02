package org.facktur.factur.modelos;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@DiscriminatorValue("EMPRESA") // Asigna "EMPRESA" al campo "tipo"
@Getter
@Setter
public class UsuarioEmpresa extends Usuario {
    @Column(name = "nombre_empresa", nullable = false, length = 150)
    private String nombreEmpresa;

    @Column(name = "ruc", unique = true, nullable = false, length = 20)
    private String ruc;
}
