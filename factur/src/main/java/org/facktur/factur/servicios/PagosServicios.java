package org.facktur.factur.servicios;

import java.util.List;
import java.util.Optional;

import org.facktur.factur.entidades.Pago;
import org.facktur.factur.entidades.Usuario;
import org.facktur.factur.repositorios.PagoRepositorio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class PagosServicios {

    @Autowired
    private PagoRepositorio pagoRepositorio;

    public List<Pago> obtenerPagosPorUsuario(Usuario usuario) {
        return pagoRepositorio.findByUsuario(usuario);
    }

	

}
