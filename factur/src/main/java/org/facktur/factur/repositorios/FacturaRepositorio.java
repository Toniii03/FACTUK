package org.facktur.factur.repositorios;

import org.facktur.factur.entidades.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FacturaRepositorio extends JpaRepository<Factura, Long>{
	
    @Query("SELECT f.numeroFactura FROM Factura f WHERE f.numeroFactura LIKE :prefijo ORDER BY f.numeroFactura DESC LIMIT 1")
    String findUltimoNumeroFacturaConPrefijo(@Param("prefijo") String prefijo);

}
