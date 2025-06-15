import { React, useEffect, useState } from "react";
import "../../styles/home/styleHome.css";
import "../../styles/paginas/paginasFacturas.css";
import Paginacion from "../COMPONENTES/Paginacion";
import { Link, useNavigate } from "react-router-dom";
import { servicioFacturas } from "../../components/SERVICIOS/servicioFacturas";
import { MenuFlotanteAccionesFacturas } from "../COMPONENTES/MenuFlotanteAccionesFacturas";
import { useMensajes } from '../../context/MensajesContext';
import { useMoneda } from '../../components/COMPONENTES/MonedaContext';
import ModalPago from "../COMPONENTES/ModalPago";


export const PaginaFacturas = () => {
  const { mostrarError, mostrarMensaje } = useMensajes();
  const [factList, setFactList] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [facturasPorPagina, setFacturasPorPagina] = useState(8);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroCliente, setFiltroCliente] = useState("");
  const [ordenFecha, setOrdenFecha] = useState("reciente");
  const { moneda } = useMoneda();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalPagarAbierto, setModalPagarAbierto] = useState(false);


  const { loadfacturas, editarFactura, eliminarFactura } = servicioFacturas;

  const [menuOpcionesCard, setMenuOpcionesCard] = useState(null);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [bloquearMenuTemporal, setBloquearMenuTemporal] = useState(false);
  const [facturaEditada, setFacturaEditada] = useState(null);
  const [menuPosicion, setMenuPosicion] = useState({ top: 0, left: 0 });
  const [facturaAEliminar, setFacturaAEliminar] = useState(null);

  const indiceInicio = (paginaActual - 1) * facturasPorPagina;
  const indiceFin = indiceInicio + facturasPorPagina;

  const facturasFiltradas = factList.filter((factura) => {
    if (filtroTexto) {
      return factura.numeroFactura.toLowerCase().startsWith(filtroTexto.toLowerCase());
    } else if (filtroCliente) {
      return factura.usuarioReceptor.toLowerCase().includes(filtroCliente.toLowerCase());
    } else {
      return true;
    }
  });

  const VerFactura = async () => {
    navigate(`/factura/${facturaSeleccionada.id}`);
  };

  const facturasOrdenadas = [...facturasFiltradas].sort((a, b) => {
    const fechaA = new Date(a.fechaLimitePago);
    const fechaB = new Date(b.fechaLimitePago);
    return ordenFecha === "reciente" ? fechaA - fechaB : fechaB - fechaA;
  });

  const facturasPagina = facturasOrdenadas.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(facturasFiltradas.length / facturasPorPagina);

  useEffect(() => {
    const cargarFacturas = async () => {
      const data = await loadfacturas();
      setFactList(data);
    };
    cargarFacturas();
  }, []);

  const EditarFactura = async (id) => {
    const datosFactura = {
      cliente: facturaEditada.usuarioReceptor,
      fechaLimitePago: new Date(facturaEditada.fechaLimitePago).toISOString(),
    };

    try {
      await editarFactura(id, datosFactura);
      const facturas = await loadfacturas();
      setFactList(facturas);
      mostrarMensaje("Factura editada");
    } catch (error) {
      mostrarError("Error al editar la factura:");
    }
  };

  const tasasCambio = {
    EUR: 1,
    USD: 1.1,
    GBP: 0.9,
  };

  const convertirImporte = (importeEUR, monedaDestino) => {
    const tasa = tasasCambio[monedaDestino] || 1;
    return importeEUR * tasa;
  };

  const formatearImporte = (importe, moneda) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: moneda,
    }).format(importe);
  };

  const confirmLogout = () => {
    setShowConfirmModal(false);
    handleEliminarFactura(facturaAEliminar);
  };

  const closeModal = () => {
    setShowConfirmModal(false);
  };

  const handleEliminarFactura = async (id) => {
    try {
      await eliminarFactura(id);
      const data = await loadfacturas();
      setFactList(data);
      mostrarMensaje("Factura eliminada correctamente.");
    } catch (error) {
      mostrarError(`${error.message}`);
    }
  };

  return (
    <div className="div-contentido">
      <div className="div_invisible"></div>
      <div className="div-visible">
        <div className="div-filtros-facturas">
          <div className="filtro-item">
            <label htmlFor="buscarUsuario">Buscar número factura</label>
            <input
              type="text"
              id="buscarUsuario"
              placeholder="Introduce el número de factura"
              className="input-filtro"
              value={filtroTexto}
              onChange={(e) => {
                setFiltroTexto(e.target.value);
                setFiltroCliente("");
                setPaginaActual(1);
              }}
            />
          </div>

          <div className="filtro-item">
            <label htmlFor="buscarCliente">Buscar por cliente</label>
            <input
              type="text"
              id="buscarCliente"
              placeholder="Búsqueda por cliente"
              className="input-filtro"
              value={filtroCliente}
              onChange={(e) => {
                setFiltroCliente(e.target.value);
                setFiltroTexto("");
                setPaginaActual(1);
              }}
            />
          </div>

          <div className="filtro-item">
            <label htmlFor="ordenFecha">Ordenar por fecha expedicion:</label>
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
        </div>

        <div className="div-crearFactura">
          <Link to="/facturas/crear" style={{ textDecoration: "none", color: "inherit" }}>
            <button className="boton-crearFactura">Crear factura</button>
          </Link>
        </div>

        <div className="div-facturas">
          {facturasPagina.map((factura, index) => (
            <article key={index} className="factura-card" aria-label={`Factura número ${factura.numeroFactura}`}>
              <div style={{ backgroundColor: "#333", padding: "0.5rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ color: "white" }} className="factura-numero">{factura.numeroFactura}</p>
                <div
                  style={{ display: "inline-block", position: "relative" }}
                  onMouseLeave={() => setMenuOpcionesCard(null)}
                >
                  {modoEdicion && facturaSeleccionada?.id === factura.id ? (
                    <div className="iconos-edicion">
                      <i
                        className="bi bi-check-circle text-success"
                        style={{ cursor: "pointer", fontSize: "1.5rem", marginRight: "0.5rem" }}
                        onClick={() => {
                          setModoEdicion(false);
                          EditarFactura(facturaSeleccionada.id);
                          setBloquearMenuTemporal(true);
                          setTimeout(() => setBloquearMenuTemporal(false), 300);
                        }}
                      />
                      <i
                        className="bi bi-x-circle text-danger"
                        style={{ cursor: "pointer", fontSize: "1.5rem" }}
                        onClick={() => {
                          setModoEdicion(false);
                          setFacturaEditada(null);
                          setBloquearMenuTemporal(true);
                          setTimeout(() => setBloquearMenuTemporal(false), 300);
                        }}
                      />
                    </div>
                  ) : (
                    <i
                      onClick={(e) => {
                        if (bloquearMenuTemporal) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const menuWidth = 200;
                        const offsetX = -50;

                        const left = rect.left + window.scrollX + offsetX;
                        const rightLimit = window.innerWidth;

                        const adjustedLeft = left + menuWidth > rightLimit
                          ? rightLimit - menuWidth - 10
                          : left;

                        setMenuPosicion({
                          top: rect.bottom + window.scrollY,
                          left: adjustedLeft
                        });
                        setMenuOpcionesCard(factura.id);
                        setFacturaSeleccionada(factura);
                      }}
                      className="bi bi-three-dots-vertical"
                      style={{ fontSize: "1.2rem", cursor: "pointer", color: "white" }}
                    ></i>
                  )}

                  {menuOpcionesCard === factura.id && (
                    <div
                      style={{
                        position: "absolute",
                        top: `${menuPosicion.top}px`,
                        left: `${menuPosicion.left}px`,
                        zIndex: 1000
                      }}
                    >
                      <MenuFlotanteAccionesFacturas
                        position={menuPosicion}
                        onPagar={() => {
                          setMenuOpcionesCard(null);
                          setFacturaSeleccionada(factura);
                          setModalPagarAbierto(true);
                        }}

                        onVerFactura={() => {
                          setMenuOpcionesCard(null);
                          setFacturaSeleccionada(factura);
                          VerFactura();
                        }}
                        onEditar={() => {
                          setMenuOpcionesCard(null);
                          setFacturaSeleccionada(factura);
                          setFacturaEditada({ ...factura });
                          setModoEdicion(true);
                        }}
                        onEliminar={() => {
                          setMenuOpcionesCard(null);
                          setShowConfirmModal(true);
                          setFacturaAEliminar(factura.id);
                        }}
                        estaPagada={factura.estado === "pagada"}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div style={{ padding: "1rem", fontSize: "1.2rem", textTransform: "uppercase" }}>
                <div className="factura-linea">
                  <p><strong>Hecha por:</strong></p>
                  <p>{factura.usuario.nombreUsuario}</p>
                </div>

                <div className="factura-linea">
                  <p><strong>Cliente:</strong></p>
                  <input
                    type="text"
                    value={
                      modoEdicion && facturaSeleccionada?.id === factura.id
                        ? facturaEditada?.usuarioReceptor ?? ''
                        : factura.usuarioReceptor
                    }
                    readOnly={!modoEdicion || facturaSeleccionada?.id !== factura.id}
                    className="factura-input"
                    onChange={(e) =>
                      setFacturaEditada((prev) => ({
                        ...prev,
                        usuarioReceptor: e.target.value
                      }))
                    }
                  />
                </div>

                <div className="factura-linea">
                  <p><strong>Importe:</strong></p>
                  <label htmlFor="">
                    {formatearImporte(convertirImporte(factura.total, moneda), moneda)}
                    <label htmlFor="" style={{ marginLeft: '0.6rem', fontSize: '1rem', color: 'grey' }}>({formatearImporte(convertirImporte(factura.totalPagado, moneda), moneda)})</label>
                  </label>
                </div>
                <div className="factura-linea">
                  <p><strong>Fecha de Expedición:</strong></p>
                  <input
                    type="date"
                    value={
                      modoEdicion && facturaSeleccionada?.id === factura.id
                        ? facturaEditada.fechaLimitePago
                          ? facturaEditada.fechaLimitePago.slice(0, 10)
                          : ''
                        : factura.fechaLimitePago
                          ? factura.fechaLimitePago.slice(0, 10)
                          : ''
                    }
                    readOnly={!modoEdicion || facturaSeleccionada?.id !== factura.id}
                    className="factura-input"
                    onChange={(e) =>
                      setFacturaEditada((prev) => ({
                        ...prev,
                        fechaLimitePago: e.target.value
                      }))
                    }
                  />
                </div>
                <div className="factura-linea">
                  <p><strong>Estado:</strong></p>
                  <span className={`factura-estado ${factura.estado}`}>{factura.estado}</span>
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

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>¿Estás seguro de que quieres eliminar la factura? {facturaSeleccionada.numeroFactura}</h3>
            <div className="modal-buttons">
              <button className="btnConfirm" onClick={confirmLogout}>Sí, Eliminar</button>
              <button className="btnCancel" onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {modalPagarAbierto && facturaSeleccionada && (
        <div className="modal-overlay">
          <div className="ContenidoModalPago" >
            <ModalPago
              factura={facturaSeleccionada}
              usuarioId={JSON.parse(localStorage.getItem('usuario'))?.id}
              isOpen={modalPagarAbierto}
              onClose={() => setModalPagarAbierto(false)}
              onPagoRealizado={async () => {
                const data = await servicioFacturas.loadfacturas();
                setFactList(data);
                setModalPagarAbierto(false);
                mostrarMensaje("Pago registrado correctamente.");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
