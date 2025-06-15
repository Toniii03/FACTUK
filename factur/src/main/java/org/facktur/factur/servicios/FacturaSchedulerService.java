package org.facktur.factur.servicios;

import org.springframework.stereotype.Service;
import org.facktur.factur.entidades.Factura;
import org.facktur.factur.repositorios.FacturaRepositorio;
import org.facktur.factur.repositorios.PagoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class FacturaSchedulerService {

    private final FacturaRepositorio facturaRepository;
    
    @Autowired
    private PagoRepositorio pagoRepositorio;

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
            Double totalPagado = pagoRepositorio.sumMontoPagadoByFactura(factura);

            if (totalPagado != null && totalPagado >= factura.getTotal()) {
                // Ya está pagada aunque no se haya actualizado el estado
                factura.setEstado("PAGADA");
            } else {
                // No ha sido pagada, se cancela
                factura.setEstado("CANCELADA");
            }
        }

        facturaRepository.saveAll(facturasVencidas);
    }
}
