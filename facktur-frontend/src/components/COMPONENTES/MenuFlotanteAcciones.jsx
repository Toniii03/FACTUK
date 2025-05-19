import { createPortal } from "react-dom";
import "../../styles/paginas/menuFlotanteAcciones.css"; 

export const MenuFlotanteAcciones = ({
    position,
    mostrarModalUser,
    onEditar,
    onEliminar,
}) => {
    return createPortal(
        <div
            className="menu-flotante border rounded shadow p-2 bg-white position-absolute"
            style={{
                top: position.top,
                left: position.left,
                zIndex: 9999,
                minWidth: "130px",
            }}
        >
            <div onClick={mostrarModalUser} className="menu-item">
                <i className="bi bi-pencil"></i> Editar
            </div>
            <div onClick={onEditar} className="menu-item">
                <i className="bi bi-lock"></i> Cambiar contraseña
            </div>
            <div onClick={onEliminar} className="menu-item text-danger">
                <i className="bi bi-trash"></i> Eliminar
            </div>
        </div>,
        document.getElementById("portal-root")
    );
};
