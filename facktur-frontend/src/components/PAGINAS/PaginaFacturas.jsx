import { React, useEffect, useState } from "react";
import "../../styles/home/styleHome.css";
import "../../styles/paginas/paginasFacturas.css";
import Paginacion from "../COMPONENTES/Paginacion";
import { Link } from "react-router-dom";
import { servicioFacturas } from "../../components/SERVICIOS/servicioFacturas";
import { MenuFlotanteAccionesFacturas } from "../COMPONENTES/MenuFlotanteAccionesFacturas";


export const PaginaFacturas = () => {

  const [factList, setFactList] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [facturasPorPagina, setFacturasPorPagina] = useState(8);
  const { loadfacturas } = servicioFacturas;
  const [menuOpcionesCard, setMenuOpcionesCard] = useState(null);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [menuPosicion, setMenuPosicion] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const cargarFacturas = async () => {
      const data = await loadfacturas();
      setFactList(data);
    };

    cargarFacturas();
  }, []);

  const indiceInicio = (paginaActual - 1) * facturasPorPagina;
  const indiceFin = indiceInicio + facturasPorPagina;
  const facturasPagina = factList.slice(indiceInicio, indiceFin);

  const totalPaginas = Math.ceil(factList.length / facturasPorPagina);



  const manejarHover = (event) => {
    const valorBoton = event.currentTarget.value;
    console.log("Valor del botón:", valorBoton);
  };

  const manejarMouseOut = () => { };

  return (
    <div className="div-contentido">
      <div className="div_invisible"></div>

      <div className="div-visible">
        <div className="div-filtros-facturas">
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

        <div className="div-crearFactura">
          <Link
            to="/facturas/crear"
            style={{ textDecoration: "none", color: "inherit" }}>
            <button className="boton-crearFactura"> Crear factura </button>
          </Link>
        </div>

        <div className="div-facturas">
          {facturasPagina.map((factura, index) => (
            <article key={index} className="factura-card" aria-label={`Factura número ${factura.numeroFactura}`}>
              <div style={{ backgroundColor: "#333", padding: "0.5rem 1rem",display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ color: "white" }} className="factura-numero">{factura.numeroFactura}</p>
                <div
                  onMouseLeave={() => setMenuOpcionesCard(null)}
                  style={{ display: "inline-block", position: "relative" }}
                >
                  <i
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setMenuOpcionesCard(factura.id);
                      setMenuPosicion({
                        top: rect.bottom + window.scrollY,
                        left: rect.right - 130 + window.scrollX,
                      });
                    }}
                    className="bi bi-three-dots-vertical"
                    style={{ fontSize: "1.2rem", cursor: "pointer",color: "white" }}
                  ></i>
                  {menuOpcionesCard === factura.id && (
                    <MenuFlotanteAccionesFacturas
                      position={menuPosicion}
                      mostrarModalUser={() => {
                        setMenuOpcionesCard(null);
                        setFacturaSeleccionada(factura);
                      }}
                      onEditarPassword={() => { console.log(factura.id);}}
                      onEliminar={() => console.log(factura.id)}
                    />
                  )}
                </div>
              </div>
              <div style={{ padding: "1rem", fontSize: "1.2rem", textTransform: "uppercase" }}>
                <div className="factura-linea">
                  <p><strong>Hecha por:</strong></p> {factura.usuario.nombreUsuario}
                </div>
                <div className="factura-linea">
                  <p><strong>Importe:</strong></p> {factura.total.toFixed(2)} €
                </div>
                <div className="factura-linea">
                  <p><strong>Fecha de Expedición:</strong></p>{new Date(factura.fechaLimitePago).toLocaleDateString()}
                </div>
                <div className="factura-linea">
                  <p><strong>Estado:</strong></p>
                  <span className={`factura-estado ${factura.estado}`}>
                    {factura.estado}
                  </span>
                </div>
              </div>

            </article>
          ))}
        </div>


        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          elementosPorPagina={facturasPorPagina}
          onPaginaChange={setPaginaActual}
          onElementosPorPaginaChange={(valor) => {
            setFacturasPorPagina(valor);
            setPaginaActual(1);
          }}
        />
      </div>
      <div id="portal-root"></div>
    </div>
  );
};
