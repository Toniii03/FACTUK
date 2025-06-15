import React from "react";
import "../../styles/home/styleHome.css";
import "../../styles/paginas/paginaResumen.css";
import FacturacionMensual from "../COMPONENTES/FacturacionMensual";

export const PaginaResumen = () => {
  return (
    <div className="div-contentido">
      <div className="div_invisible"></div>

      <div className="div-visible-resumen">
          <div className="seccion grafica">
            <h2>Facturación Mensual</h2>
            <FacturacionMensual />
          </div>
        </div>
      </div>
  );
};
