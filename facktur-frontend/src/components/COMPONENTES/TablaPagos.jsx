import React, { useState } from "react";
import Paginacion from "./Paginacion";

const pagosData = [
  {
    factura: "F123",
    cliente: "Antonio",
    fechaPago: "2025-04-28",
    estado: "Pagado",
    montoPagado: 300,
    totalFactura: 300,
    metodoPago: "Tarjeta",
  },
  
  {
    factura: "F123",
    cliente: "Antonio",
    fechaPago: "2025-04-28",
    estado: "Pagado",
    montoPagado: 300,
    totalFactura: 300,
    metodoPago: "Tarjeta",
  },
  {
    factura: "F124",
    cliente: "Laura",
    fechaPago: "2025-05-05",
    estado: "Pendiente",
    montoPagado: 0,
    totalFactura: 200,
    metodoPago: null,
  },
  {
    factura: "F125",
    cliente: "Carlos",
    fechaPago: "2025-04-25",
    estado: "Parcial",
    montoPagado: 100,
    totalFactura: 300,
    metodoPago: "Transferencia",
  },
  {
    factura: "F126",
    cliente: "María",
    fechaPago: "2025-04-30",
    estado: "Pagado",
    montoPagado: 500,
    totalFactura: 500,
    metodoPago: "Efectivo",
  },
  {
    factura: "F127",
    cliente: "Luis",
    fechaPago: "2025-05-01",
    estado: "Pendiente",
    montoPagado: 0,
    totalFactura: 150,
    metodoPago: null,
  },
  {
    factura: "F128",
    cliente: "Sandra",
    fechaPago: "2025-04-20",
    estado: "Parcial",
    montoPagado: 50,
    totalFactura: 200,
    metodoPago: "Tarjeta",
  },
  {
    factura: "F129",
    cliente: "Juan",
    fechaPago: "2025-05-10",
    estado: "Pendiente",
    montoPagado: 0,
    totalFactura: 250,
    metodoPago: null,
  },
  {
    factura: "F130",
    cliente: "Patricia",
    fechaPago: "2025-04-15",
    estado: "Pagado",
    montoPagado: 600,
    totalFactura: 600,
    metodoPago: "Transferencia",
  },
  {
    factura: "F131",
    cliente: "Eduardo",
    fechaPago: "2025-04-29",
    estado: "Pendiente",
    montoPagado: 0,
    totalFactura: 350,
    metodoPago: null,
  },
  {
    factura: "F132",
    cliente: "Gabriela",
    fechaPago: "2025-04-23",
    estado: "Parcial",
    montoPagado: 150,
    totalFactura: 400,
    metodoPago: "Tarjeta",
  },
];

const getEstadoColor = (estado, fechaPago) => {
  const hoy = new Date();
  const fecha = new Date(fechaPago);
  const diferenciaDias = Math.ceil((fecha - hoy) / (1000 * 60 * 60 * 24));

  if (estado === "Pagado") {
    return "#d4edda";
  }
  if (estado === "Parcial") {
    return "#fff3cd"; 
  }

  if (estado === "Pendiente") {
    if (diferenciaDias < 0) {
      return "#f8d7da";
    } else {
      return "#ffffff";
    }
  }

  return "#ffffff";
};

const TablaPagos = () => {
  const [pagos, setPagos] = useState(pagosData);
  const [paginaActual, setPaginaActual] = useState(1);
  const [pagosPorPagina, setPagosPorPagina] = useState(5); 

  const indiceInicio = (paginaActual - 1) * pagosPorPagina;
  const indiceFin = indiceInicio + pagosPorPagina;
  const pagosPagina = pagos.slice(indiceInicio, indiceFin);

  const totalPaginas = Math.ceil(pagos.length / pagosPorPagina);

  const manejarCambioPorPagina = (event) => {
    setPagosPorPagina(Number(event.target.value)); 
    setPaginaActual(1);
  };

  return (
    <div className="tabla-pagos">
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
          {pagosPagina.map((pago, index) => (
            <tr
              key={index}
              style={{
                backgroundColor: getEstadoColor(pago.estado, pago.fechaPago),
                height: "60px",
              }}
            >
              <td>{pago.factura}</td>
              <td>{pago.cliente}</td>
              <td>{pago.fechaPago ? pago.fechaPago : "Pendiente"}</td>
              <td>{pago.estado}</td>
              <td>{pago.montoPagado} €</td>
              <td>{pago.totalFactura} €</td>
              <td>{pago.metodoPago ? pago.metodoPago : "N/A"}</td>
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
