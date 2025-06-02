import { createPortal } from "react-dom";
import "../../styles/paginas/menuFlotanteAcciones.css";

export const MenuFlotanteAccionesFacturas = ({
    position,
    onVerFactura,
    onEditar,
    onEliminar,
    onPagar,
    estaPagada
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
            <div onClick={onVerFactura} className="menu-item">
                <i className="bi bi-files"></i> Ver Factura
            </div>
            <div onClick={onEditar} className="menu-item">
                <i className="bi bi-pencil"></i> Editar Factura
            </div>
            {!estaPagada && (
                <div onClick={onPagar} className="menu-item text-success">
                    <i className="bi bi-cash"></i> Pagar Factura
                </div>
            )}
            <div onClick={onEliminar} className="menu-item text-danger">
                <i className="bi bi-trash"></i> Eliminar
            </div>
        </div>,
        document.getElementById("portal-root")
    );
};
