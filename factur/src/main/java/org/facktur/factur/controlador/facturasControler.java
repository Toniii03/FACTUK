package org.facktur.factur.controlador;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.facktur.factur.EntidadesDTO.FacturaEditarRequest;
import org.facktur.factur.EntidadesDTO.FacturaRequest;
import org.facktur.factur.entidades.Factura;
import org.facktur.factur.entidades.FacturaArticulo;
import org.facktur.factur.servicios.ServicioFacturas;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    
    @GetMapping("/{id}")
    public Optional<Factura> obtenerFacturasById(@PathVariable Long id) {
        return servicioFacturas.findById(id);
    }
    
    @GetMapping("/{id}/articulos")
    public List<FacturaArticulo> obtenerArticulosByFacturaId(@PathVariable Long id) {
        return servicioFacturas.obtenerArticulosByFacturaId(id);
    }
    
    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<String> eliminarFactura(@PathVariable Long id) {
	    try {
	        Factura factura = servicioFacturas.eliminarFactura(id);

	        return ResponseEntity.status(HttpStatus.CREATED).body("Factura eliminada correctamente");

	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al eliminar la factura");
	    }
    	
    	
    }
    
    @PostMapping("/crear")
    public ResponseEntity<?> crearFactura(@RequestBody FacturaRequest datosFactura) {
        try {
        	servicioFacturas.crearFactura(datosFactura);
        	return ResponseEntity.ok(Map.of("mensaje", "Factura creada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                 .body(Map.of("mensaje", e.getMessage()));
        }
    }

    @PutMapping("/editar/{id}")
	public ResponseEntity<Map<String, Object>> crearFactura(
			@PathVariable Long id,
	        @RequestBody FacturaEditarRequest request) {
	    Map<String, Object> respuesta = new HashMap<>();

	    try {
	        Factura factura = servicioFacturas.EditarFactura(id, request);

	        respuesta.put("mensaje", "Factura Editada correctamente");
	        respuesta.put("numeroFactura", factura.getNumeroFactura());

	        return ResponseEntity.status(HttpStatus.CREATED).body(respuesta);

	    } catch (Exception e) {
	        respuesta.put("mensaje", "Error al editar la factura");
	        respuesta.put("error", e.getMessage());
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(respuesta);
	    }
	}

}
