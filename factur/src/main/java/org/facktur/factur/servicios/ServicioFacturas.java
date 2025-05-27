package org.facktur.factur.servicios;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.facktur.factur.EntidadesDTO.FacturaEditarRequest;
import org.facktur.factur.EntidadesDTO.FacturaRequest;
import org.facktur.factur.EntidadesDTO.FacturacionSemanalDTO;
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
		    return facturaRepositorio.findAllByOrderByFechaLimitePagoAsc();
	}


	
	public Factura EditarFactura(Long idFactura,FacturaEditarRequest nuevaFactura) {
		
		 Factura factura = facturaRepositorio.findById(idFactura)
			        .orElseThrow(() -> new RuntimeException("Factura no encontrada con ID: " + idFactura));
		 
		 factura.setUsuarioReceptor(nuevaFactura.getCliente());
		 factura.setFechaLimitePago(nuevaFactura.getFechaLimitePago());
		 return facturaRepositorio.save(factura);
	}

	public Factura eliminarFactura(Long id) {
		 Factura factura = facturaRepositorio.findById(id)
		            .orElseThrow(() -> new RuntimeException("Factura no encontrada con ID: " + id));
		 
		 List<FacturaArticulo> articulos = facturaArticuloRepositorio.findByFacturaId(id);
		 facturaArticuloRepositorio.deleteAll(articulos);
		 
		 facturaRepositorio.delete(factura);
		
		 return factura;
	}

	public Optional<Factura> findById(Long id) {
		return facturaRepositorio.findById(id);
	}

	public List<FacturaArticulo> findArticulosById(Long id) {
		return facturaArticuloRepositorio.findByFacturaId(id);
	}

	public List<FacturaArticulo> obtenerArticulosByFacturaId(Long id) {
		return facturaArticuloRepositorio.findByFacturaId(id);
	}
	
	private int getSemanaDelMes(LocalDate fecha) {
	    LocalDate primerDiaMes = fecha.withDayOfMonth(1);
	    int primerDiaSemana = primerDiaMes.getDayOfWeek().getValue();
	    int diaDelMes = fecha.getDayOfMonth();
	    return ((diaDelMes + primerDiaSemana - 2) / 7) + 1;
	}

	public List<FacturacionSemanalDTO> obtenerResumenPorPeriodo(String startDate, String endDate, Long userId) {
		String mes = startDate.substring(0, 7);
        Date start = java.sql.Date.valueOf(startDate);
        Date end = java.sql.Date.valueOf(endDate);
        
        List<Object[]> resultados = facturaRepositorio.obtenerDatosFacturasPorPeriodoYUsuario(start, end, userId);


	    Map<Integer, FacturacionSemanalDTO> mapaSemanas = new HashMap<>();

	    for (int i = 1; i <= 5; i++) {
	        FacturacionSemanalDTO dtoVacio = new FacturacionSemanalDTO();
	        dtoVacio.setSemana(i);
	        dtoVacio.setMes(mes);
	        dtoVacio.setPagadas(0);
	        dtoVacio.setPendientes(0);
	        dtoVacio.setTotalPagado(0.0);
	        dtoVacio.setTotalPendiente(0.0);
	        mapaSemanas.put(i, dtoVacio);
	    }

	    for (Object[] fila : resultados) {
	        Timestamp ts = (Timestamp) fila[0];
	        LocalDate fecha = ts.toLocalDateTime().toLocalDate();
	        String estado = (String) fila[1];
	        double total = ((Number) fila[2]).doubleValue();

	        int semanaDelMes = getSemanaDelMes(fecha);
	        FacturacionSemanalDTO dto = mapaSemanas.get(semanaDelMes);

	        if ("PAGADA".equals(estado)) {
	            dto.setPagadas(dto.getPagadas() + 1);
	            dto.setTotalPagado(dto.getTotalPagado() + total);
	        } else if ("PENDIENTE".equals(estado)) {
	            dto.setPendientes(dto.getPendientes() + 1);
	            dto.setTotalPendiente(dto.getTotalPendiente() + total);
	        }
}

	    return mapaSemanas.values().stream()
	            .sorted(Comparator.comparingInt(FacturacionSemanalDTO::getSemana))
	            .toList();
	}

}
