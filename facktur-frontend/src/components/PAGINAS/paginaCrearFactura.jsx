import React, { useEffect, useState } from "react";
import "../../styles/paginas/paginaCrearFactura.css";
import { useNavigate } from "react-router-dom";
import { usePrompt } from "../COMPONENTES/usePrompt";
import { servicioFacturas } from "../../components/SERVICIOS/servicioFacturas";
import { useMoneda } from "../COMPONENTES/MonedaContext";

export const PaginaCrearFactura = () => {
  const [articulos, setArticulos] = useState([]);
  const [nuevoArticulo, setNuevoArticulo] = useState({
    nombre: "",
    cantidad: 1,
    precio: "",
  });
  const [cliente, setCliente] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [errorMensaje, setErrorMensaje] = useState("");
  const [errorOculto, setErrorOculto] = useState(false);
  const [formEnviado, setFormEnviado] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigate = useNavigate();
  const { crearFactura } = servicioFacturas;
  const { moneda } = useMoneda();

  const { confirmNavigation, cancelNavigation } = usePrompt(
    "Tienes cambios sin guardar. ¿Deseas salir?",
    articulos.length > 0 && !formEnviado,
    () => {
      if (formEnviado) {
        confirmNavigation();
      } else {
        setShowConfirmModal(true);
      }
    }
  );

  const formatoImporte = (cantidad) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: moneda,
    }).format(cantidad);
  };

  const handleChangeArticulo = (e) => {
    const { name, value } = e.target;
    setNuevoArticulo((prev) => ({
      ...prev,
      [name]: name === "nombre" ? value : parseFloat(value),
    }));
  };

  const agregarArticulo = () => {
    if (!nuevoArticulo.nombre || nuevoArticulo.cantidad <= 0 || nuevoArticulo.precio <= 0) return;
    setArticulos([...articulos, nuevoArticulo]);
    setNuevoArticulo({ nombre: "", cantidad: 1, precio: "" });
  };

  const eliminarArticulo = (index) => {
    setArticulos(articulos.filter((_, i) => i !== index));
  };

  const cancelarFactura = () => {
    navigate("/facturas");
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (articulos.length > 0 && !formEnviado) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [articulos, formEnviado]);

  const confirmLogout = () => {
    setShowConfirmModal(false);
    confirmNavigation();
  };

  const closeModal = () => {
    setShowConfirmModal(false);
    cancelNavigation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (articulos.length === 0) {
      setErrorMensaje("* Debe haber al menos 1 artículo en la factura *");
      setErrorOculto(false);
      setTimeout(() => setErrorOculto(true), 4000);
      setTimeout(() => setErrorMensaje(""), 4300);
      return;
    }

    const factura = {
      usuarioId: JSON.parse(localStorage.getItem("usuario"))?.id,
      usuarioReceptor: cliente,
      articulos: articulos,
      fechaEmision: new Date().toISOString().split("T")[0],
      total: articulos.reduce((acc, art) => acc + art.cantidad * art.precio, 0),
      fechaLimitePago: fechaLimite,
      estado: "PENDIENTE",
    };

    setErrorMensaje("");

    try {
      setFormEnviado(true);
      await crearFactura(factura);
      setCliente("");
      setArticulos([]);
      setFechaLimite("");
      navigate("/facturas");
    } catch (error) {
      setErrorMensaje(error.message || "Error de red o del servidor");
    }
  };

  return (
    <div className="div-contentido">
      <div className="div_invisible"></div>
      <div className="div-visible">
        <div className="usuario-header">Crear Factura</div>

        <form className="formulario-factura" onSubmit={handleSubmit}>
          <div className="fila-formulario">
            <div className="grupo-campo">
              <label htmlFor="remitente">De</label>
              <input
                type="text"
                id="remitente"
                name="remitente"
                value={JSON.parse(localStorage.getItem("usuario"))?.nombreUsuario}
                readOnly
                required
              />
            </div>
            <div className="grupo-campo">
              <label htmlFor="cliente">Para</label>
              <input
                type="text"
                id="cliente"
                name="cliente"
                placeholder="Cliente"
                onChange={(e) => setCliente(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="fila-formulario">
            <div className="grupo-campo">
              <label htmlFor="fechaEmision">Fecha de Emisión</label>
              <input
                type="date"
                id="fechaEmision"
                name="fechaEmision"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="input-fecha"
              />
            </div>
            <div className="grupo-campo">
              <label htmlFor="fechaVencimiento">Fecha de Vencimiento</label>
              <input
                type="date"
                id="fechaVencimiento"
                name="fechaVencimiento"
                required
                className="input-fecha"
                onChange={(e) => setFechaLimite(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <button type="submit" className="boton-crear">Crear Factura</button>
            <button type="button" className="boton-cancelar" onClick={cancelarFactura}>Cancelar Factura</button>
          </div>
        </form>

        <div className="formulario-articulo">
          <div className="error-container">
            {errorMensaje && (
              <p className={`mensaje-error ${errorOculto ? "oculto" : ""}`}>{errorMensaje}</p>
            )}
          </div>

          <div className="campos-container">
            <div className="grupo-campo">
              <label htmlFor="nombre">Artículo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Artículo"
                value={nuevoArticulo.nombre}
                onChange={handleChangeArticulo}
                required
              />
            </div>

            <div className="grupo-campo">
              <label htmlFor="cantidad">Cantidad</label>
              <input
                type="number"
                id="cantidad"
                name="cantidad"
                placeholder="Cantidad"
                value={nuevoArticulo.cantidad}
                onChange={handleChangeArticulo}
                required
                min="1"
              />
            </div>

            <div className="grupo-campo">
              <label htmlFor="precio">Precio Unitario</label>
              <input
                type="number"
                id="precio"
                name="precio"
                placeholder="Precio unitario"
                value={nuevoArticulo.precio}
                onChange={handleChangeArticulo}
                required
                min="0.00"
                step="0.5"
              />
            </div>

            <div className="boton-container">
              <button className="button-addArticulo" type="button" onClick={agregarArticulo}>
                Añadir
              </button>
            </div>
          </div>
        </div>

        <div className="tabla-articulos-wrapper">
          <table className="tabla-articulos">
            <thead>
              <tr>
                <th>Artículo</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
          </table>

          <div className="tabla-articulos-body-scroll">
            <table className="tabla-articulos2">
              <tbody>
                {articulos.map((art, index) => (
                  <tr key={index}>
                    <td>{art.nombre}</td>
                    <td>{art.cantidad}</td>
                    <td>{formatoImporte(art.precio)}</td>
                    <td>{formatoImporte(art.cantidad * art.precio)}</td>
                    <td>
                      <button onClick={() => eliminarArticulo(index)} className="boton-icono">
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Layout de tarjetas para móvil */}
          <div className="mobile-articles-container">
            {articulos.map((art, index) => (
              <div key={index} className="mobile-article-card">
                <div className="mobile-article-header">
                  <div className="mobile-article-name">{art.nombre}</div>
                  <button
                    onClick={() => eliminarArticulo(index)}
                    className="mobile-delete-btn"
                    aria-label="Eliminar artículo"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>

                <div className="mobile-article-details">
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Cantidad</span>
                    <span className="mobile-detail-value">{art.cantidad}</span>
                  </div>
                  <div className="mobile-detail-item">
                    <span className="mobile-detail-label">Precio Unit.</span>
                    <span className="mobile-detail-value">{formatoImporte(art.precio)}</span>
                  </div>
                </div>

                <div className="mobile-article-total">
                  <span className="mobile-total-label">Total:</span>
                  {formatoImporte(art.cantidad * art.precio)}
                </div>
              </div>
            ))}

            {articulos.length === 0 && (
              <div className="mobile-article-card" style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
                No hay artículos agregados
              </div>
            )}
          </div>

        </div>

        <p className="total-factura">
          Total de la factura: {formatoImporte(articulos.reduce((acc, art) => acc + art.cantidad * art.precio, 0))}
        </p>
      </div>

      {showConfirmModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>¿Estás seguro de que quieres salir? Perderás todos los cambios.</h3>
            <div className="modal-buttons">
              <button className="btnConfirm" onClick={confirmLogout}>Sí, salir</button>
              <button className="btnCancel" onClick={closeModal}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
