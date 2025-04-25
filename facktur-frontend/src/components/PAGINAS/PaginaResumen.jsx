import React from "react";
import "../../styles/home/styleHome.css";
import "../../styles/paginas/paginaResumen.css";
import FacturacionMensual from "../COMPONENTES/FacturacionMensual";

export const PaginaResumen = () => {
  return (
    <div className="div-contentido">
      <div className="div_invisible"></div>

      <div className="div-visible">
        <div className="contenedor-dashboard">
          <div className="seccion">
            <h2>Resumen de Actividad</h2>
            <div className="resumen">
              <div className="item-resumen">
                <h3>Últimas Facturas</h3>
                {/* Aquí se mostrarían las últimas facturas, podría ser una tabla */}
              </div>
              <div className="item-resumen">
                <h3>Pagos Recientes</h3>
                {/* Aquí se mostrarían los pagos recientes, otra tabla o lista */}
              </div>
            </div>
          </div>

          <div className="seccion grafica">
            <h2>Facturación Mensual</h2>
            <FacturacionMensual />
          </div>
        </div>
      </div>
    </div>
  );
};
