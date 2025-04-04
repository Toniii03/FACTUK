package org.facktur.factur.entidades;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name="factura")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Factura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FacturaArticulo> facturaArticulos; 

    @OneToMany(mappedBy = "factura", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Pago> pagos;

    @Column(nullable = false)
    private Double total;

    @Column(nullable = false)
    private Double totalPagado;

    @Column(nullable = false)
    private String estado; 

    @Temporal(TemporalType.DATE)
    @Column(nullable = false)
    private Date fechaLimitePago;

    public Double calcularTotal() {
        return facturaArticulos.stream()
                .mapToDouble(fa -> fa.getArticulo().getPrecio() * fa.getCantidad())
                .sum();
    }

    public Double calcularTotalPagado() {
        return pagos.stream().mapToDouble(Pago::getMontoPagado).sum();
    }
}
