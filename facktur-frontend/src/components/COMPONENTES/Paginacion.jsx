import React from "react";
import "../../styles/paginas/paginacion.css";

const Paginacion = ({
  paginaActual,
  totalPaginas,
  elementosPorPagina,
  onPaginaChange,
  onElementosPorPaginaChange,
}) => {
  return (
    <div className="paginacion">
      <button
        onClick={() => onPaginaChange(Math.max(paginaActual - 1, 1))}
        disabled={paginaActual === 1}
      >
        Anterior
      </button>

      <span>
        Página {paginaActual} de {totalPaginas}
      </span>

      <button
        onClick={() => onPaginaChange(Math.min(paginaActual + 1, totalPaginas))}
        disabled={paginaActual === totalPaginas}
      >
        Siguiente
      </button>

      <div className="selector-pagina">
        <div>
          <label htmlFor="elementosPorPagina">Nº elementos:</label>
          <select
            id="elementosPorPagina"
            onChange={(e) => onElementosPorPaginaChange(parseInt(e.target.value))}
            value={elementosPorPagina}
          >
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="12">12</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Paginacion;
