package org.facktur.factur.repositorios;

import org.facktur.factur.entidades.FacturaArticulo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacturaArticuloRepositorio extends JpaRepository<FacturaArticulo, Long> {
	
	
}
