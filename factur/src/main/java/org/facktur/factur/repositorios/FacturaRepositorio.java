package org.facktur.factur.repositorios;

import org.facktur.factur.entidades.Factura;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacturaRepositorio extends JpaRepository<Factura, Long>{

}
