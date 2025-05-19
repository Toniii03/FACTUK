import { useEffect, useState } from "react";
import Paginacion from "../COMPONENTES/Paginacion";
import "../../styles/paginas/paginaGestionUsuarios.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { MenuFlotanteAcciones } from "../COMPONENTES/MenuFlotanteAcciones";
import { PortalVerUsuario } from "../PORTALES/PortalVerUsuario";


export const PaginaGestionUsuarios = () => {

    const Usuarios = [
        {
            id: 16,
            nombreUsuario: "antonio_superlargoasdasdasdsadadsasadsad",
            nombre: "Antonio",
            email: "antonio@example.com",
            contrasena: "hashedPassword1",
            tipo: "ADMIN",
        },
        {
            id: 2,
            nombreUsuario: "laura_23",
            nombre: "Laura",
            email: "laura@example.com",
            contrasena: "hashedPassword2",
            tipo: "USUARIO",
        },
        {
            id: 3,
            nombreUsuario: "carlos_abc",
            nombre: "Carlos",
            email: "carlos@example.com",
            contrasena: "hashedPassword3",
            tipo: "USUARIO",
        },
        {
            id: 4,
            nombreUsuario: "elena_xyz",
            nombre: "Elena",
            email: "elena@example.com",
            contrasena: "hashedPassword4",
            tipo: "USUARIO",
        },
        {
            id: 5,
            nombreUsuario: "antonio_largo_otra_vez",
            nombre: "Antonio",
            email: "antonio2@example.com",
            contrasena: "hashedPassword5",
            tipo: "USUARIO",
        },
        {
            id: 6,
            nombreUsuario: "laura_dev",
            nombre: "Laura",
            email: "laura2@example.com",
            contrasena: "hashedPassword6",
            tipo: "ADMIN",
        },
        {
            id: 7,
            nombreUsuario: "carlos_1990",
            nombre: "Carlos",
            email: "carlos2@example.com",
            contrasena: "hashedPassword7",
            tipo: "USUARIO",
        },
        {
            id: 8,
            nombreUsuario: "elena_dev_2024",
            nombre: "Elena",
            email: "elena2@example.com",
            contrasena: "hashedPassword8",
            tipo: "USUARIO",
        },
        {
            id: 9,
            nombreUsuario: "antonio_dev_muy_largo_1234567890",
            nombre: "Antonio",
            email: "antonio3@example.com",
            contrasena: "hashedPassword9",
            tipo: "USUARIO",
        },
        {
            id: 10,
            nombreUsuario: "laura_admin_2024",
            nombre: "Laura",
            email: "laura3@example.com",
            contrasena: "hashedPassword10",
            tipo: "ADMIN",
        },
    ];

    const [menuOpciones, setMenuOpciones] = useState(null);
    const [menuPosicion, setMenuPosicion] = useState({ top: 0, left: 0 });

    const [busqueda, setBusqueda] = useState("");
    const [paginaActual, setPaginaActual] = useState(1);
    const [usuariosPorPaginas, setUsariosPorPaginas] = useState(8);

    const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    const indiceInicio = (paginaActual - 1) * usuariosPorPaginas;
    const indiceFin = indiceInicio + usuariosPorPaginas;
    const [tiposSeleccionados, setTiposSeleccionados] = useState(["todo"]);

    const [modoVista, setModoVista] = useState("cuadricula");


    const usuariosFiltrados = Usuarios.filter((u) => {
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
                nuevosTipos = nuevosTipos.filter(t => t !== tipo);
            } else {
                nuevosTipos.push(tipo);
            }

            if (nuevosTipos.length === 0) {
                nuevosTipos = ["todo"];
            }

            const tiposValidos = ["admin", "usuario", "empresas"];
            if (tiposValidos.every(t => nuevosTipos.includes(t))) {
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

                        <div className="filtro-vista">
                            <button className="boton-crearFactura"> Nuevo <i className="bi bi-person fs-4"></i></button>

                        </div>
                    </div>

                    <div className="filtro-vista">
                        <button
                            className={`filtro-boton ${modoVista === "cuadricula" ? "activo" : ""}`}
                            onClick={() => setModoVista("cuadricula")}
                            title="Vista de cuadrícula"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                                <path d="M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z" />
                            </svg>
                        </button>
                        <button
                            className={`filtro-boton ${modoVista === "lista" ? "activo" : ""}`}
                            onClick={() => setModoVista("lista")}
                            title="Vista de lista"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                                <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 0h14V7H7v2zm0 4h14v-2H7v2zm0 4h14v-2H7v2z" />
                            </svg>
                        </button>
                    </div>

                    <div className={`usuarios-grid ${modoVista}`}>
                        {ListadoUsuarios.map((usuario) => (
                            <div className={`usuario-card ${modoVista}`} key={usuario.id}>
                                <div className="usuario-header">
                                    <h3
                                        className="usuario-nombre-usuario"
                                        title={usuario.nombreUsuario}
                                    >
                                        {usuario.nombreUsuario.length > 22
                                            ? usuario.nombreUsuario.slice(0, 22).toUpperCase() + "..."
                                            : usuario.nombreUsuario.toUpperCase()}
                                    </h3>
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
                                    <span className="label">Tipo:</span>
                                    <span className={`tipo-badge ${usuario.tipo.toLowerCase()}`}>{usuario.tipo}</span>
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
                                                    setMenuOpciones(false);
                                                    setUsuarioSeleccionado(usuario);
                                                    setMostrarModalUsuario(true);
                                                }}
                                                onEditar={() => console.log(usuario.id)}
                                                onEliminar={() => console.log(usuario.id)}
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
            </div>
        </div>
    );
};
