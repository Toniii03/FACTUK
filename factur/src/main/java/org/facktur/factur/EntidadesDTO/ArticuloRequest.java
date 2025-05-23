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
public class ArticuloRequest {	
	private String nombre;
    private int cantidad;
    private double precio;
}
