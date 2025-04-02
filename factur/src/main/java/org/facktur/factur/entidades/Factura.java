package org.facktur.factur.entidades;

import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="factura")
@Getter
@Setter
public class Factura {

	@Id 
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name="usuario")
	private Usuario usuario;
		
	
    @ManyToMany
    @JoinTable(
        name = "factura_articulo", // Nombre de la tabla intermedia
        joinColumns = @JoinColumn(name = "factura_id"), // Clave foránea para Factura
        inverseJoinColumns = @JoinColumn(name = "articulo_id") // Clave foránea para Articulo
    )
	private List<Articulo> articulos;
	
	
}
