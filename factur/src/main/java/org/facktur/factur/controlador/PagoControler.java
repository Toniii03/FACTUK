package org.facktur.factur.controlador;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.facktur.factur.EntidadesDTO.PagoDTO;
import org.facktur.factur.entidades.Factura;
import org.facktur.factur.entidades.Pago;
import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.repositorios.FacturaRepositorio;
import org.facktur.factur.repositorios.PagoRepositorio;
import org.facktur.factur.repositorios.UsuarioRepositorio;
import org.facktur.factur.servicios.PagosServicios;
import org.facktur.factur.servicios.ServicioFacturas;
import org.facktur.factur.servicios.ServicioUsuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/pagos")
public class PagoControler {

    @Autowired
    private PagoRepositorio pagoRepositorio;

    @Autowired
    private ServicioUsuario servicioUsuario;

    @Autowired
    private ServicioFacturas servicioFacturas;

    @Autowired
    private FacturaRepositorio facturaRepositorio;
    
    @Autowired
    private PagosServicios pagosServicios;
    
    @GetMapping
    public ResponseEntity<?> obtenerPagosDelUsuarioAutenticado() {
        Optional<Usuario> usuarioOpt = servicioUsuario.obtenerUsuarioAutenticado();

        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Usuario no autenticado");
        }

        Usuario usuario = usuarioOpt.get();
        List<Pago> pagos = pagosServicios.obtenerPagosPorUsuario(usuario);

        return ResponseEntity.ok(pagos);
    }

    @PostMapping
    public ResponseEntity<?> registrarPago(@RequestBody PagoDTO pagoDTO) {
        Optional<Usuario> usuarioOpt = servicioUsuario.findUsuarioByID(pagoDTO.getUsuarioId());
        Optional<Factura> facturaOpt = servicioFacturas.findById(pagoDTO.getFacturaId());

        if (usuarioOpt.isEmpty() || facturaOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Usuario o factura no encontrados");
        }

        if (pagoDTO.getMontoPagado() == null || pagoDTO.getMontoPagado() <= 0) {
            return ResponseEntity.badRequest().body("El monto del pago debe ser mayor que cero");
        }

        Factura factura = facturaOpt.get();

        Pago pago = new Pago();
        pago.setUsuario(usuarioOpt.get());
        pago.setFactura(factura);
        pago.setMontoPagado(pagoDTO.getMontoPagado());
        pago.setMetodoPago(pagoDTO.getMetodoPago());
        pago.setFechaPago(new Date());

        pagoRepositorio.save(pago);

        Double nuevoTotalPagado = (factura.getTotalPagado() != null ? factura.getTotalPagado() : 0.0) + pagoDTO.getMontoPagado();
        factura.setTotalPagado(nuevoTotalPagado);

        if (nuevoTotalPagado >= factura.getTotal()) {
            factura.setEstado("pagada");
        }

        facturaRepositorio.save(factura);

        Map<String, Object> response = new HashMap<>();
        response.put("mensaje", "Pago registrado correctamente");
        response.put("totalPagado", factura.getTotalPagado());
        response.put("estadoFactura", factura.getEstado());

        return ResponseEntity.ok(response);
    }
}

