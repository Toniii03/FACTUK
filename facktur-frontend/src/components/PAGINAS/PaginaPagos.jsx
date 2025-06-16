import React, { useState, useEffect } from "react";
import "../../styles/home/styleHome.css";
import "../../styles/paginas/paginaPagos.css";
import TablaPagos from "../COMPONENTES/TablaPagos";

export const PaginaPagos = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [pagos, setPagos] = useState([]);
  const [filtroUsuario, setFiltroUsuario] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("reciente");

  const [paginaActual, setPaginaActual] = useState(1);
  const [pagosPorPagina, setPagosPorPagina] = useState(8);

  const [filtroEstado, setFiltroEstado] = useState("");


  useEffect(() => {
    const obtenerPagos = async () => {
      try {
        const url = `${API_URL}pagos`;
        const response = await fetch(url, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setPagos(data);
        } else {
          console.error("Error al obtener pagos:", response.status);
        }
      } catch (error) {
        console.error("Error de red al obtener pagos:", error);
      }
    };

    obtenerPagos();
  }, []);

  const pagosFiltrados = pagos.filter((pago) => {
    const coincideUsuario = pago.factura?.usuarioReceptor
      ?.toLowerCase()
      .startsWith(filtroUsuario.toLowerCase());

    const coincideEstado =
      filtroEstado === "" || pago.factura?.estado?.toUpperCase() === filtroEstado;

    return coincideUsuario && coincideEstado;
  });


  const pagosOrdenados = pagosFiltrados.sort((a, b) => {
    const fechaA = new Date(a.fechaPago);
    const fechaB = new Date(b.fechaPago);
    return ordenFecha === "reciente"
      ? fechaB - fechaA
      : fechaA - fechaB;
  });

  const totalPaginas = Math.ceil(pagosOrdenados.length / pagosPorPagina);
  const indiceInicio = (paginaActual - 1) * pagosPorPagina;
  const indiceFin = indiceInicio + pagosPorPagina;
  const pagosPaginados = pagosOrdenados.slice(indiceInicio, indiceFin);

  return (
    <div className="div-contentido">
      <div className="div_invisible"></div>
      <div className="div-visible">
        <div className="div-filtros-pagos">
          <div className="filtro-item">
            <label htmlFor="buscarUsuario">Buscar por usuario:</label>
            <input
              type="text"
              id="buscarUsuario"
              placeholder="Introduce un nombre de usuario"
              className="input-filtro"
              value={filtroUsuario}
              onChange={(e) => {
                setFiltroUsuario(e.target.value);
                setPaginaActual(1);
              }}
            />
          </div>
          <div className="filtro-item">
            <label htmlFor="ordenFecha">Ordenar por fecha:</label>
            <select
              id="ordenFecha"
              className="input-filtro"
              value={ordenFecha}
              onChange={(e) => {
                setOrdenFecha(e.target.value);
                setPaginaActual(1);
              }}
            >
              <option value="reciente">Más reciente</option>
              <option value="antiguo">Más antiguo</option>
            </select>
          </div>

          <div className="filtro-item">
            <label htmlFor="estadoFactura">Filtrar por estado:</label>
            <select
              id="estadoFactura"
              className="input-filtro"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="PAGADA">PAGADA</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>
        </div>

        <TablaPagos
          pagos={pagosPaginados}
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          pagosPorPagina={pagosPorPagina}
          setPaginaActual={setPaginaActual}
          setPagosPorPagina={setPagosPorPagina}
        />
      </div>
    </div>
  );
};
