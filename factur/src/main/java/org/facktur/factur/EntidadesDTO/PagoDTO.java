package org.facktur.factur.EntidadesDTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PagoDTO {
    private Long usuarioId;
    private Long facturaId;
    private Double montoPagado;
    private String metodoPago;
}
