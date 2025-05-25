package org.facktur.factur.EntidadesDTO;

import java.util.Date;

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
public class FacturaEditarRequest {

	private String cliente;
	private Date fechaLimitePago;
}
