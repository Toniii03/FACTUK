package org.facktur.factur.EntidadesDTO;

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
public class FacturacionSemanalDTO {
    private String mes;
    private int semana;
    private long pagadas;
    private long pendientes;
    private double totalPagado;
    private double totalPendiente;
}
