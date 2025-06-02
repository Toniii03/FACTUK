import React, { useState, useEffect } from "react";
import "../../styles/home/styleHome.css";
import "../../styles/paginas/paginaPagos.css";
import TablaPagos from "../COMPONENTES/TablaPagos";

export const PaginaPagos = () => {
  const [pagos, setPagos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [pagosPorPagina, setPagosPorPagina] = useState(8);

  useEffect(() => {
    const obtenerPagos = async () => {
      try {
        const url = 'http://localhost:8080/pagos' 
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

  const totalPaginas = Math.ceil(pagos.length / pagosPorPagina);
  const indiceInicio = (paginaActual - 1) * pagosPorPagina;
  const indiceFin = indiceInicio + pagosPorPagina;
  const pagosPaginados = pagos.slice(indiceInicio, indiceFin);

  return (
    <div className="div-contentido">
      <div className="div_invisible"></div>
      <div className="div-visible">
        <div className="div-filtros">
          <div className="filtro-item">
            <label htmlFor="buscarUsuario">Buscar por usuario:</label>
            <input
              type="text"
              id="buscarUsuario"
              placeholder="Introduce un nombre de usuario"
              className="input-filtro"
            />
          </div>
          <div className="filtro-item">
            <label htmlFor="ordenFecha">Ordenar por fecha:</label>
            <select id="ordenFecha" className="input-filtro">
              <option value="reciente">Más reciente</option>
              <option value="antiguo">Más antiguo</option>
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
