package org.facktur.factur.EntidadesDTO;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class FacturaRequest {

	private Long usuarioId;
	private String usuarioReceptor; 
	private List<ArticuloRequest> articulos;
	private Date fechaEmision;
    private Double total;
	private LocalDate fechaLimitePago;
	private String estado;
	    
}
