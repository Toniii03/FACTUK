package org.facktur.factur.controlador;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.facktur.factur.EntidadesDTO.FacturaRequest;
import org.facktur.factur.entidades.Factura;
import org.facktur.factur.servicios.ServicioFacturas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/facturas")
public class facturasControler {
	
	@Autowired ServicioFacturas servicioFacturas;
	
    @GetMapping
    public ResponseEntity<List<Factura>> obtenerFacturas() {
        List<Factura> facturas = servicioFacturas.findAll();
        return ResponseEntity.ok(facturas);
    }
	
	
	@PostMapping("/crear")
	public ResponseEntity<Map<String, Object>> crearFactura(@RequestBody FacturaRequest request) {
	    Map<String, Object> respuesta = new HashMap<>();

	    try {
	        Factura factura = servicioFacturas.crearFactura(request);

	        respuesta.put("mensaje", "Factura creada correctamente");
	        respuesta.put("numeroFactura", factura.getNumeroFactura());

	        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);

	    } catch (Exception e) {
	        respuesta.put("mensaje", "Error al crear la factura");
	        respuesta.put("error", e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
	    }
	}

}
