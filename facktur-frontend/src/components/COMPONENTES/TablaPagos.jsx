import React from "react";
import Paginacion from "./Paginacion";

const TablaPagos = ({
  pagos,
  paginaActual,
  totalPaginas,
  pagosPorPagina,
  setPaginaActual,
  setPagosPorPagina,
}) => {

  const getEstadoColor = (estado, fechaPago) => {
    const hoy = new Date();
    const fecha = new Date(fechaPago);
    const diferenciaDias = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));
    const estadoNormalizado = (estado || "").toUpperCase();

    if (estadoNormalizado === "PAGADO" || estadoNormalizado === "PAGADA") return "#d4edda";
    if (estadoNormalizado === "PENDIENTE") return "#fff3cd";
    if (estadoNormalizado === "CANCELADA") return "#f8d7da";

    return "#ffffff";
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "Pendiente";
    const fecha = new Date(fechaISO);
    const dia = String(fecha.getDate()).padStart(2, "0");
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  };

  return (
    <div className="">
      <h2>Pagos de Facturas</h2>
      <table>
        <thead>
          <tr>
            <th>Factura</th>
            <th>Cliente</th>
            <th>Fecha de Pago</th>
            <th>Estado</th>
            <th>Monto Pagado</th>
            <th>Total Factura</th>
            <th>Método de Pago</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: getEstadoColor(pago.factura.estado, pago.fechaPago),
              }}
            >
              <td data-label="Factura">{pago.factura.numeroFactura}</td>
              <td data-label="Cliente">{pago.factura.usuarioReceptor}</td>
              <td data-label="Fecha de Pago">{formatearFecha(pago.fechaPago)}</td>
              <td data-label="Estado">{pago.factura.estado.toUpperCase()}</td>
              <td data-label="Monto Pagado">{pago.montoPagado} €</td>
              <td data-label="Total Factura">{pago.factura.total} €</td>
              <td data-label="Método de Pago">{pago.metodoPago || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Paginacion
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        elementosPorPagina={pagosPorPagina}
        onPaginaChange={setPaginaActual}
        onElementosPorPaginaChange={(valor) => {
          setPagosPorPagina(valor);
          setPaginaActual(1);
        }}
      />
    </div>
  );
};

export default TablaPagos;
