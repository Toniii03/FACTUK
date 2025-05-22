import { useState } from "react";
import servicioUsuarios from "../SERVICIOS/ServicioUsuarios";
import { useMensajes } from '../../context/MensajesContext';

export const ModalCambiarContrasenaUsuario = ({ idUsuario, onClose, onSuccess }) => {
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [error, setError] = useState("");
  const { mostrarError, mostrarMensaje } = useMensajes();

  const handleGuardar = async () => {
    if (nuevaContrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (nuevaContrasena !== confirmacion) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      await servicioUsuarios.cambiarContrasena(idUsuario, nuevaContrasena);
      mostrarMensaje("Contraseña actualizada correctamente");
      onClose();
    } catch (e) {
      console.error(e);
      mostrarError("Hubo un error al actualizar la contraseña.");
    }
  };

  return (
    <div className="modal-overlay-cambiarPass">
      <div className="modal-cambiarPass">
        <h3>Cambiar Contraseña</h3>
        <div className="form-group">
          <label>Nueva contraseña</label>
          <input
            type="password"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Confirmar contraseña</label>
          <input
            type="password"
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="modal-buttons-cambiarPass">
          <button className="btnConfirmar" onClick={handleGuardar}>Guardar</button>
          <button className="btnCancelar" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};
