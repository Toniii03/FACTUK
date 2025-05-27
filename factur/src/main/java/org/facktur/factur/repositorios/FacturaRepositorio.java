package org.facktur.factur.repositorios;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;

import org.facktur.factur.EntidadesDTO.FacturacionSemanalDTO;
import org.facktur.factur.entidades.Factura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface FacturaRepositorio extends JpaRepository<Factura, Long>{
	
    @Query("SELECT f.numeroFactura FROM Factura f WHERE f.numeroFactura LIKE :prefijo ORDER BY f.numeroFactura DESC LIMIT 1")
    String findUltimoNumeroFacturaConPrefijo(@Param("prefijo") String prefijo);
    
    List<Factura> findAllByOrderByFechaLimitePagoAsc();
    

    @Query("""
    	    SELECT f.fechaEmision, f.estado, f.total
    	    FROM Factura f
    	    WHERE f.fechaEmision BETWEEN :startDate AND :endDate
    	      AND f.usuario.id = :userId
    	""")
    List<Object[]> obtenerDatosFacturasPorPeriodoYUsuario(
    	    @Param("startDate") java.util.Date start,
    	    @Param("endDate") java.util.Date end,
    	    @Param("userId") Long userId
    	);
}
