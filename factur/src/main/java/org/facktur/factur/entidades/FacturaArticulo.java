package org.facktur.factur.entidades;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "factura_articulo")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FacturaArticulo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "factura_id", nullable = false)
    private Factura factura;  // Relación con la factura

    @ManyToOne
    @JoinColumn(name = "articulo_id", nullable = false)
    private Articulo articulo;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Double precioUnitario;

    public Double getSubtotal() {
        return cantidad * precioUnitario;
    }
}
