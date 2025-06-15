package org.facktur.factur.repositorios;

import java.util.List;

import org.facktur.factur.entidades.Factura;
import org.facktur.factur.entidades.Pago;
import org.facktur.factur.entidades.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PagoRepositorio extends JpaRepository<Pago, Long> {

	List<Pago> findByUsuario(Usuario usuario);
	
	List<Pago> findByUsuarioOrderByFechaPagoDesc(Usuario usuario);

	@Query("SELECT SUM(p.montoPagado) FROM Pago p WHERE p.factura = :factura")
	Double sumMontoPagadoByFactura(@Param("factura") Factura factura);
	


}
