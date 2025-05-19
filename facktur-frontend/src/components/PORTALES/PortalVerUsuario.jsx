import { createPortal } from "react-dom";
import "../../styles/paginas/modalUserDetail.css";
import { useEffect, useState } from "react";
import servicioUsuarios from "../SERVICIOS/ServicioUsuarios";
import { CheckBoxTipoUsuario } from "../COMPONENTES/CheckBoxTipoUsuario";
import { useMensajes } from '../../context/MensajesContext';

export const PortalVerUsuario = ({ idUsuario, children, onClose }) => {

    const { mostrarError, mostrarMensaje } = useMensajes();
    const { BuscarUsuarioPorId, ActualizarusuarioPorId } = servicioUsuarios;

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

        const datosParaEnviar = {
            nombreUsuario: formData.nombreUsuario,
            nombre: formData.nombre,
            email: formData.email,
            tipo: formData.tipo
        };

        try {
            await ActualizarusuarioPorId(idUsuario, datosParaEnviar);
            onClose();
            mostrarMensaje("Usuario Actualizado correctamente");
        } catch (error) {
            mostrarError("Error actualizando usuario:");
        }
    };;

    return createPortal(
        <>
            {/* Fondo oscuro (backdrop) */}
            <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} />

            {/* Modal flotante */}
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
                                            className="form-control"
                                            id="nombreUsuario"
                                            name="nombreUsuario"
                                            value={formData.nombreUsuario}
                                            onChange={handleChange}
                                            required
                                            maxLength={50}
                                            placeholder="ej: usuario123"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="nombre" className="form-label">
                                            Nombre completo
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nombre"
                                            name="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                            maxLength={100}
                                            placeholder="ej: Nombre Apellidos"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="form-label">
                                            Correo electrónico
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            maxLength={100}
                                            placeholder="ej: example@example.com"
                                        />
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
