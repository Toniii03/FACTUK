import { createPortal } from "react-dom";
import "../../styles/paginas/modalUserDetail.css";
import { useEffect, useState } from "react";
import servicioUsuarios from "../SERVICIOS/ServicioUsuarios";
import { CheckBoxTipoUsuario } from "../COMPONENTES/CheckBoxTipoUsuario";
import { useMensajes } from '../../context/MensajesContext';

export const PortalVerUsuario = ({ idUsuario, onClose }) => {

    const { mostrarError, mostrarMensaje } = useMensajes();
    const { BuscarUsuarioPorId, ActualizarusuarioPorId } = servicioUsuarios;
    const [errores, setErrores] = useState({});

    const validarCampos = () => {
        const nuevosErrores = {};

        if (!formData.nombreUsuario.trim()) {
            nuevosErrores.nombreUsuario = "El nombre de usuario es obligatorio.";
        } else if (formData.nombreUsuario.length > 50) {
            nuevosErrores.nombreUsuario = "Máximo 50 caracteres.";
        }

        if (!formData.nombre.trim()) {
            nuevosErrores.nombre = "El nombre completo es obligatorio.";
        }

        if (!formData.email.trim()) {
            nuevosErrores.email = "El correo electrónico es obligatorio.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            nuevosErrores.email = "El correo electrónico debe tener un formato válido.";
        }

        setErrores(nuevosErrores);

        return Object.keys(nuevosErrores).length === 0;
    };




    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                const response = await BuscarUsuarioPorId(idUsuario);
                setFormData(response);
            } catch (error) {
                console.error("Error en la petición:", error);
            }
        };

        fetchUsuario();
    }, [BuscarUsuarioPorId, idUsuario]);

    const [formData, setFormData] = useState({
        nombreUsuario: "",
        nombre: "",
        email: "",
        tipo: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarCampos()) return;

        const datosParaEnviar = {
            nombreUsuario: formData.nombreUsuario,
            nombre: formData.nombre,
            email: formData.email,
            tipo: formData.tipo,
        };

        try {
            await ActualizarusuarioPorId(idUsuario, datosParaEnviar);
            onClose();
            mostrarMensaje("Usuario Actualizado correctamente");
        } catch (error) {
            mostrarError("Error actualizando usuario:");
        }
    }

    return createPortal(
        <>
            <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />

            <div
                className="modal show d-block"
                style={{
                    width: "65vw",
                    height: "75vh",
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    padding: "0",
                }}
            >
                <div
                    className="modal-dialog"
                    style={{ maxWidth: "100%", width: "100%" }}
                >
                    <div className="modal-content" style={{ border: "none" }}>
                        <div className="modal-header py-2" style={{ backgroundColor: "#fac563b7", color: "white" }}>
                            <h2 className="modal-title">Detalles del usuario</h2>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={onClose}
                            ></button>
                        </div>
                        <div
                            className="modal-body"
                            style={{ height: "100%", overflowY: "auto", justifyContent: "center", display: "flex", marginTop: "5%" }}
                        >
                            {/* Contenido del body del modal */}
                            <form onSubmit={handleSubmit} className="form-usuario-detalle">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="nombreUsuario" className="form-label">
                                            Nombre de usuario
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errores.nombreUsuario ? 'is-invalid' : ''}`}
                                            id="nombreUsuario"
                                            name="nombreUsuario"
                                            value={formData.nombreUsuario}
                                            onChange={handleChange}
                                            required
                                            maxLength={50}
                                            placeholder="ej: usuario123"
                                        />
                                        {errores.nombreUsuario && (<div className="invalid-feedback">{errores.nombreUsuario}</div>)}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="nombre" className="form-label">
                                            Nombre completo
                                        </label>
                                        <input
                                            type="text"
                                            className={`form-control ${errores.nombreUsuario ? 'is-invalid' : ''}`}
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                            maxLength={100}
                                            placeholder="ej: Nombre Apellidos"
                                        />
                                        {errores.nombre && (<div className="invalid-feedback">{errores.nombre}</div>)}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">
                                            Correo electrónico
                                        </label>
                                        <input
                                            type="email"
                                            className={`form-control ${errores.nombreUsuario ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            maxLength={100}
                                            placeholder="ej: example@example.com"
                                        />
                                        {errores.email && (<div className="invalid-feedback">{errores.email}</div>)}
                                    </div>
                                </div>

                                <CheckBoxTipoUsuario formData={formData} setFormData={setFormData} />

                                <div className="div-boton">
                                    <button type="submit" className="boto_confirmar">
                                        Guardar cambios
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>,
        document.getElementById("portal-verUsuario")
    );
};
