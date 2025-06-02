package org.facktur.factur.servicios;

import org.springframework.stereotype.Service;
import org.facktur.factur.entidades.Factura;
import org.facktur.factur.repositorios.FacturaRepositorio;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class FacturaSchedulerService {

    private final FacturaRepositorio facturaRepository;

    public FacturaSchedulerService(FacturaRepositorio facturaRepository) {
        this.facturaRepository = facturaRepository;
    }

    @Scheduled(cron = "0 0 * * * *") // Cada hora Se actualiza el estado de las facturas
    
    @Transactional
    public void cancelarFacturasVencidas() {
        LocalDate hoy = LocalDate.now();
        List<Factura> facturasVencidas = facturaRepository
            .findByEstadoNotAndFechaLimitePagoBefore("CANCELADA", hoy);

        for (Factura factura : facturasVencidas) {
            if (!factura.getEstado().equals("PAGADA")) {
                factura.setEstado("CANCELADA");
            }
        }

        facturaRepository.saveAll(facturasVencidas);
    }
}
