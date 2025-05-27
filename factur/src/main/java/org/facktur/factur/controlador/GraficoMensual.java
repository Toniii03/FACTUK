package org.facktur.factur.controlador;

import org.facktur.factur.EntidadesDTO.FacturacionSemanalDTO;
import org.facktur.factur.repositorios.FacturaRepositorio;
import org.facktur.factur.servicios.ServicioFacturas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/facturacion-mensual")
public class GraficoMensual {
  
    @Autowired
    private ServicioFacturas servicioFacturas;

    @GetMapping
    public ResponseEntity<?> obtenerResumen(
            @RequestParam String start,
            @RequestParam String end,
            @RequestParam Long userId) {

        List<FacturacionSemanalDTO> resultados = servicioFacturas.obtenerResumenPorPeriodo(start, end, userId);
        System.out.print("ID USUARIOOO"+userId);
        return ResponseEntity.ok(resultados);
    }

}
