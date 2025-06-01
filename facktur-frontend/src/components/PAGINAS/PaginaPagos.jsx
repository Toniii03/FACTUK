import React, { useState } from "react";
import "../../styles/home/styleHome.css";
import "../../styles/paginas/paginaPagos.css";
import TablaPagos from "../COMPONENTES/TablaPagos";


export const PaginaPagos = () => {
  const pagos = [
    { usuario: "Antonio", cantidad: "100 €", fecha: "2024-05-01" },
    { usuario: "Laura", cantidad: "200 €", fecha: "2024-04-28" },
    { usuario: "Carlos", cantidad: "300 €", fecha: "2024-04-15" },
    { usuario: "Lucía", cantidad: "120 €", fecha: "2024-04-10" },
    { usuario: "Javier", cantidad: "80 €", fecha: "2024-04-01" },
    { usuario: "Marta", cantidad: "150 €", fecha: "2024-03-20" },
    { usuario: "Sergio", cantidad: "90 €", fecha: "2024-03-10" },
    { usuario: "Ana", cantidad: "110 €", fecha: "2024-02-25" },
    { usuario: "Pedro", cantidad: "210 €", fecha: "2024-02-15" },
    { usuario: "Elena", cantidad: "180 €", fecha: "2024-02-05" },
    { usuario: "Andrés", cantidad: "160 €", fecha: "2024-01-20" },
  ];

  const [paginaActual, setPaginaActual] = useState(1);
  const [pagosPorPagina, setPagosPorPagina] = useState(5);

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
            <select
              id="ordenFecha"
              className="input-filtro"
            >
              <option value="reciente">Más reciente</option>
              <option value="antiguo">Más antiguo</option>
            </select>
          </div>
        </div>

        <TablaPagos pagos={pagosPaginados} />
      </div>
    </div>
  );
};
