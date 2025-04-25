import { React, useState } from "react";
import "../../styles/home/styleHome.css";
import "../../styles/paginas/paginasFacturas.css";

export const PaginaFacturas = () => {
  const factList = [
    { hechapor: "Antonio", importe: "203 €", fechaExpedicion: "20/05/2024" },
    { hechapor: "Laura", importe: "150 €", fechaExpedicion: "15/04/2024" },
    { hechapor: "Carlos", importe: "98 €", fechaExpedicion: "10/03/2024" },
    { hechapor: "Elena", importe: "320 €", fechaExpedicion: "05/02/2024" },
    { hechapor: "Javier", importe: "450 €", fechaExpedicion: "25/01/2024" },
    { hechapor: "Marta", importe: "275 €", fechaExpedicion: "30/12/2023" },
    { hechapor: "Andrés", importe: "600 €", fechaExpedicion: "18/11/2023" },
    { hechapor: "Lucía", importe: "210 €", fechaExpedicion: "09/10/2023" },
    { hechapor: "Sergio", importe: "125 €", fechaExpedicion: "01/09/2023" },
    { hechapor: "Ana", importe: "340 €", fechaExpedicion: "20/08/2023" },
  ];

  const [paginaActual, setPaginaActual] = useState(1);
  const [tooltip, setTooltip] = useState("");
  const facturasPorPagina = 6;

  const indiceInicio = (paginaActual - 1) * facturasPorPagina;
  const indiceFin = indiceInicio + facturasPorPagina;
  const facturasPagina = factList.slice(indiceInicio, indiceFin);

  const totalPaginas = Math.ceil(factList.length / facturasPorPagina);

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
              onChange={(e) => console.log("Buscando:", e.target.value)}
            />
          </div>

          <div className="filtro-item">
            <label htmlFor="ordenFecha">Ordenar por fecha:</label>
            <select
              id="ordenFecha"
              className="input-filtro"
              onChange={(e) => console.log("Ordenar por:", e.target.value)}
            >
              <option value="reciente">Más reciente</option>
              <option value="antiguo">Más antiguo</option>
            </select>
          </div>
        </div>

        <div className="div-facturas">
          {facturasPagina.map((factura, index) => (
            <div key={index} className="factura-card">
              <p>
                <strong>Hecha por:</strong> {factura.hechapor}
              </p>
              <p>
                <strong>Importe:</strong> {factura.importe}
              </p>
              <p>
                <strong>Fecha de Expedición:</strong> {factura.fechaExpedicion}
              </p>


              <div className="botones-factura">
              {tooltip && <div className="tooltip">{tooltip}</div>}
                <button
                  className="btn-imprimir"
                  onMouseEnter={() => setTooltip("Imprimir factura")}
                  onMouseLeave={() => setTooltip("")}
                ></button>
                <button
                  className="btn-editar"
                  onMouseEnter={() => setTooltip("Editar factura")}
                  onMouseLeave={() => setTooltip("")}
                ></button>
                <button
                  className="btn-borrar"
                  onMouseEnter={() => setTooltip("Borrar factura")}
                  onMouseLeave={() => setTooltip("")}
                ></button>
              </div>
            </div>
          ))}
        </div>

        <div className="paginacion">
          <button
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
          >
            Anterior
          </button>
          <span>
            Página {paginaActual} de {totalPaginas}
          </span>
          <button
            onClick={() =>
              setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))
            }
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};
