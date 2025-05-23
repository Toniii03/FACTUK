package org.facktur.factur.servicios;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.facktur.factur.EntidadesDTO.FacturaRequest;
import org.facktur.factur.entidades.Factura;
import org.facktur.factur.entidades.FacturaArticulo;
import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.repositorios.FacturaArticuloRepositorio;
import org.facktur.factur.repositorios.FacturaRepositorio;
import org.facktur.factur.repositorios.UsuarioRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ServicioFacturas {
	
	@Autowired 
	private FacturaRepositorio facturaRepositorio;
	
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;
    
    @Autowired
    private FacturaArticuloRepositorio facturaArticuloRepositorio;
	
	 public Factura crearFactura(FacturaRequest datosFactura) {
	        String numero = generarNumeroFactura();
	        Usuario usuario = usuarioRepositorio.findById(datosFactura.getUsuarioId())
					.orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
	        
	        Factura factura = new Factura();
	        factura.setNumeroFactura(numero);
	        factura.setUsuario(usuario);
	        factura.setUsuarioReceptor(datosFactura.getUsuarioReceptor());
	        factura.setFechaEmision(datosFactura.getFechaEmision());
	        factura.setTotal(datosFactura.getTotal());
	        factura.setTotalPagado(0D);
	        factura.setEstado(datosFactura.getEstado());
	        factura.setFechaLimitePago(datosFactura.getFechaLimitePago());
	        
	        facturaRepositorio.save(factura);
	        
	        List<FacturaArticulo> articulos = datosFactura.getArticulos().stream()
	                .map(dto -> {
	                    FacturaArticulo fa = new FacturaArticulo();
	                    fa.setFactura(factura);
	                    fa.setArticulo(dto.getNombre());
	                    fa.setCantidad(dto.getCantidad());
	                    fa.setPrecioUnitario(dto.getPrecio());
	                    return fa;
	                })
	                .collect(Collectors.toList());

	        facturaArticuloRepositorio.saveAll(articulos);
	        
	        return factura;

	    }
	 
	 private String generarNumeroFactura() {
	        String prefijo = "FAC-" + new SimpleDateFormat("yyyyMM").format(new Date());

	        String ultimo = facturaRepositorio.findUltimoNumeroFacturaConPrefijo(prefijo + "%");

	        int siguienteNumero = 1;
	        if (ultimo != null) {
	            String[] partes = ultimo.split("-");
	            if (partes.length == 3) {
	                siguienteNumero = Integer.parseInt(partes[2]) + 1;
	            }
	        }

	        return String.format("%s-%04d", prefijo, siguienteNumero);
	    }

	public List<Factura> findAll() {
		return facturaRepositorio.findAll();
	}

}
