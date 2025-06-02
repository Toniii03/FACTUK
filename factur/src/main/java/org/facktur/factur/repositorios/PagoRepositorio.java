package org.facktur.factur.repositorios;

import java.util.List;

import org.facktur.factur.entidades.Pago;
import org.facktur.factur.entidades.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PagoRepositorio extends JpaRepository<Pago, Long> {

	List<Pago> findByUsuario(Usuario usuario);

}
