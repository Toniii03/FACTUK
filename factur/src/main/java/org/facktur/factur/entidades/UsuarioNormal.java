package org.facktur.factur.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@DiscriminatorValue("NORMAL") // Asigna "NORMAL" al campo "tipo"
@Getter
@Setter
public class UsuarioNormal extends Usuario {
    @Column(name = "preferencias", length = 255)
    private String preferencias;
}
