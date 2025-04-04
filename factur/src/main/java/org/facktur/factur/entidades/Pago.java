package org.facktur.factur.entidades;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name="pago")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pago {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "factura_id", nullable = false)
    private Factura factura;

    @Column(name = "monto_factura",nullable = false)
    private Double montoPagado;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "fecha_pago",nullable = false)
    private Date fechaPago;

    @Column(name = "metodo_Pago",nullable = true)
    private String metodoPago;
}
