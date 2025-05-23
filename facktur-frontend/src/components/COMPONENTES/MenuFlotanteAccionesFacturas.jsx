import { createPortal } from "react-dom";
import "../../styles/paginas/menuFlotanteAcciones.css"; 

export const MenuFlotanteAccionesFacturas = ({
    position,
    mostrarModalUser,
    onEditarPassword,
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
                maxWidth: "250px",
            }}
        >
            <div onClick={mostrarModalUser} className="menu-item">
                <i className="bi bi-pencil"></i> Clonar Factura
            </div>
            <div onClick={onEditarPassword} className="menu-item">
                <i className="bi bi-lock"></i> Editar Factura
            </div>
            <div onClick={onEliminar} className="menu-item text-danger">
                <i className="bi bi-trash"></i> Eliminar
            </div>
        </div>,
        document.getElementById("portal-root")
    );
};
