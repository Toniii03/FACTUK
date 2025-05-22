import { useEffect, useState } from "react";
import Paginacion from "../COMPONENTES/Paginacion";
import "../../styles/paginas/paginaGestionUsuarios.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { MenuFlotanteAcciones } from "../COMPONENTES/MenuFlotanteAcciones";
import { PortalVerUsuario } from "../PORTALES/PortalVerUsuario";
import servicioUsuarios from "../SERVICIOS/ServicioUsuarios";
import { useMensajes } from '../../context/MensajesContext';
import { ModalCambiarContrasenaUsuario } from "../COMPONENTES/ModalCambiarContrasenaUsuario";

export const PaginaGestionUsuarios = () => {

  const [usuarios, setUsuarios] = useState([]);
  const [menuOpciones, setMenuOpciones] = useState(null);
  const [menuOpcionesCard, setMenuOpcionesCard] = useState(null);
  const [menuPosicion, setMenuPosicion] = useState({ top: 0, left: 0 });
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [mostrarModalCambioContrasena, setMostrarModalCambioContrasena] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [usuariosPorPaginas, setUsariosPorPaginas] = useState(8);
  const { mostrarError, mostrarMensaje } = useMensajes();

  const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const indiceInicio = (paginaActual - 1) * usuariosPorPaginas;
  const indiceFin = indiceInicio + usuariosPorPaginas;
  const [tiposSeleccionados, setTiposSeleccionados] = useState(["todo"]);

  const [modoVista, setModoVista] = useState("cuadricula");

  useEffect(() => {
    const cargarUsuarios = async () => {
      const data = await servicioUsuarios.loadUsuarios();
      setUsuarios(data);
    };

    cargarUsuarios();
  }, []);

  const openModal = (id) => {
    setMenuOpciones(null);
    setMenuOpcionesCard(null);
    setTimeout(() => {
      setUsuarioAEliminar(null);
      setUsuarioAEliminar(id);
    }, 0);
  };

  const closeModal = () => {
    setUsuarioAEliminar(null);
  };


  const confirmEliminarUsuario = async () => {
    try {
      await servicioUsuarios.EliminarUsuario(usuarioAEliminar);
      mostrarMensaje("Usuario eliminado correctamente");

      const nuevosUsuarios = await servicioUsuarios.loadUsuarios();
      setUsuarios(nuevosUsuarios);

      closeModal();
    } catch (error) {
      console.error(error);
      mostrarError("Ocurrió un error inesperado al borrar el usuario");
    }
  };


  const usuariosFiltrados = usuarios.filter((u) => {
    const coincideTipo =
      tiposSeleccionados.includes("todo") ||
      tiposSeleccionados.includes(u.tipo.toLowerCase());

    const coincideBusqueda =
      u.nombre.toLowerCase().startsWith(busqueda) ||
      u.nombreUsuario.toLowerCase().startsWith(busqueda);

    return coincideTipo && coincideBusqueda;
  });

  const ListadoUsuarios = usuariosFiltrados.slice(indiceInicio, indiceFin);
  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPaginas);

  useEffect(() => {
    if (paginaActual > totalPaginas) {
      setPaginaActual(1);
    }
  }, [paginaActual, totalPaginas]);

  const handleTipoClick = (tipo) => {
    if (tipo === "todo") {
      setTiposSeleccionados(["todo"]);
    } else {
      let nuevosTipos = [...tiposSeleccionados];

      if (nuevosTipos.includes("todo")) {
        nuevosTipos = [];
      }

      if (nuevosTipos.includes(tipo)) {
        nuevosTipos = nuevosTipos.filter((t) => t !== tipo);
      } else {
        nuevosTipos.push(tipo);
      }

      if (nuevosTipos.length === 0) {
        nuevosTipos = ["todo"];
      }

      const tiposValidos = ["admin", "usuario", "empresas"];
      if (tiposValidos.every((t) => nuevosTipos.includes(t))) {
        nuevosTipos = ["todo"];
      }

      setTiposSeleccionados(nuevosTipos);
    }
  };

  return (
    <div className="div-home">
      <div className="div-contentido">
        <div className="div_invisible">
          {/*Este div simula el div del menu flotante*/}
        </div>

        <div className="div-contenido_visible">
          <div className="div-filtros">
            <div className="filtro-busqueda">
              <input
                type="text"
                id="buscarUsuario"
                placeholder="Buscar usuario..."
                className="input-busqueda"
                onChange={(e) => {
                  setBusqueda(e.target.value.toLowerCase());
                  setPaginaActual(1);
                }}
              />
            </div>

            <div className="filtro-tipos">
              {["Todo", "Admin", "Usuario", "Empresas"].map((tipo) => {
                const tipoLower = tipo.toLowerCase();
                const activo = tiposSeleccionados.includes(tipoLower);

                return (
                  <button
                    key={tipo}
                    className={`filtro-boton ${activo ? "activo" : ""}`}
                    onClick={() => handleTipoClick(tipoLower)}
                  >
                    {tipo}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filtro-vista">
            <div className="leyenda-tipos">
              <div class="item">
                <div class="cuadro admin"></div>
                <span class="label">Administrador</span>
              </div>
              <div class="item">
                <div class="cuadro usuario"></div>
                <span class="label">Usuario</span>
              </div>
              <div class="item">
                <div class="cuadro empresa"></div>
                <span class="label">Empresa</span>
              </div>
            </div>

            <button
              className={`filtro-boton ${modoVista === "cuadricula" ? "activo" : ""
                }`}
              onClick={() => setModoVista("cuadricula")}
              title="Vista de cuadrícula"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 0 24 24"
                width="20"
                fill="currentColor"
              >
                <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" />
              </svg>
            </button>
            <button
              className={`filtro-boton ${modoVista === "lista" ? "activo" : ""
                }`}
              onClick={() => setModoVista("lista")}
              title="Vista de lista"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20"
                viewBox="0 0 24 24"
                width="20"
                fill="currentColor"
              >
                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 0h14V7H7v2zm0 4h14v-2H7v2zm0 4h14v-2H7v2z" />
              </svg>
            </button>
          </div>

          <div className={`usuarios-grid ${modoVista}`}>
            {ListadoUsuarios.map((usuario) => (
              <div className={`usuario-card ${modoVista}`} key={usuario.id}>
                <div className="usuario-header">
                  {modoVista === "cuadricula" ? (
                    <span
                      className="usuario-nombre-cuadricula"
                      title={usuario.nombreUsuario}
                    >
                      <div>
                        {usuario.nombreUsuario.length > 22
                          ? usuario.nombreUsuario.slice(0, 22).toUpperCase() + "..."
                          : usuario.nombreUsuario.toUpperCase()}
                      </div>
                      <div
                        onMouseLeave={() => setMenuOpcionesCard(null)}
                        style={{ display: "inline-block", position: "relative" }}
                      >
                        <i
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setMenuOpcionesCard(usuario.id);
                            setMenuPosicion({
                              top: rect.bottom + window.scrollY,
                              left: rect.right - 130 + window.scrollX,
                            });
                          }}
                          className="bi bi-three-dots-vertical"
                          style={{ fontSize: "1.2rem", cursor: "pointer" }}
                        ></i>
                        {menuOpcionesCard === usuario.id && (
                          <MenuFlotanteAcciones
                            position={menuPosicion}
                            mostrarModalUser={() => {
                              setMenuOpcionesCard(null);
                              setUsuarioSeleccionado(usuario);
                              setMostrarModalUsuario(true);
                            }}
                            onEditarPassword={() => {
                              setUsuarioSeleccionado(usuario);
                              setMostrarModalCambioContrasena(true);
                            }}
                            onEliminar={() => openModal(usuario.id)}
                          />
                        )}
                      </div>
                    </span>
                  ) : (
                    <h3
                      className="usuario-nombre-usuario"
                      title={usuario.nombreUsuario}
                    >
                      {usuario.nombreUsuario.length > 22
                        ? usuario.nombreUsuario.slice(0, 22).toUpperCase() + "..."
                        : usuario.nombreUsuario.toUpperCase()}
                    </h3>
                  )}
                </div>

                <div className="usuario-detalle">
                  <span className="label">Nombre:</span>
                  <span className="valor">{usuario.nombre}</span>
                </div>
                <div className="usuario-detalle">
                  <span className="label">Email:</span>
                  <span className="valor">{usuario.email}</span>
                </div>
                <div className="usuario-detalle">
                  <span className="label">Tipo: </span>
                  <span className={`tipo-badge ${usuario.tipo.toLowerCase()}`}>
                    {usuario.tipo}
                  </span>
                </div>

                {modoVista !== "cuadricula" && (
                  <div
                    className="menu-hover-wrapper"
                    onMouseLeave={() => setMenuOpciones(null)}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <div className="usuario-Footer">
                      <i
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setMenuOpciones(usuario.id);
                          setMenuPosicion({
                            top: rect.bottom + window.scrollY,
                            left: rect.right - 130 + window.scrollX,
                          });
                        }}
                        className="bi bi-three-dots-vertical"
                        style={{ fontSize: "1.2rem", cursor: "pointer" }}
                      ></i>
                    </div>
                    {menuOpciones === usuario.id && (
                      <MenuFlotanteAcciones
                        position={menuPosicion}
                        mostrarModalUser={() => {
                          setMenuOpciones(null);
                          setUsuarioSeleccionado(usuario);
                          setMostrarModalUsuario(true);
                        }}
                        onEditarPassword={() => {
                          setUsuarioSeleccionado(usuario);
                          setMostrarModalCambioContrasena(true);
                        }}
                        onEliminar={() => openModal(usuario.id)}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>


          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            elementosPorPagina={usuariosPorPaginas}
            onPaginaChange={setPaginaActual}
            onElementosPorPaginaChange={(valor) => {
              setUsariosPorPaginas(valor);
              setPaginaActual(1);
            }}
          />
        </div>
        <div id="portal-root"></div>
        <div id="portal-verUsuario">
          {mostrarModalUsuario && (
            <PortalVerUsuario
              idUsuario={usuarioSeleccionado.id}
              onClose={() => {
                setMostrarModalUsuario(false);
                setUsuarioSeleccionado(null);
              }}
            />
          )}
        </div>
        {mostrarModalCambioContrasena && (
          <ModalCambiarContrasenaUsuario
            idUsuario={usuarioSeleccionado.id}
            onClose={() => {
              setMostrarModalCambioContrasena(false);
              setUsuarioSeleccionado(null);
            }}
            onSuccess={(msg) => mostrarMensaje(msg)}
          />
        )}
      </div>
      {usuarioAEliminar !== null && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>¿Estás seguro de que quieres eliminar este usuario?</h3>
            <div className="modal-buttons">
              <button className="btnConfirm" onClick={confirmEliminarUsuario}>
                Sí, eliminar
              </button>
              <button className="btnCancel" onClick={closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
