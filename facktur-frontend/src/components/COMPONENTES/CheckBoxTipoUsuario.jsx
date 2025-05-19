import React from 'react';
import "../../styles/paginas/checkBoxTipoUsuario.css"

export const CheckBoxTipoUsuario = ({ formData, setFormData }) => {

    const tipoSeleccionado = formData.tipo;

    return (
        <div className="mb-3">
            <label className="form-label label-titulo">Tipo de usuario</label>
            <div className="checkbox-container" style={{ display: "flex", gap: "20px" }}>
                <div className="form-check form-check-inline" style={{ display: "flex", alignItems: "center" }}>
                    <input
                        className="form-check-input tipo-checkbox"
                        type="radio"
                        id="tipoAdmin"
                        name="tipo"
                        value="ADM"
                        checked={tipoSeleccionado === "ADM"}
                        onChange={() => setFormData((prev) => ({ ...prev, tipo: "ADM" }))}
                    />
                    <label
                        className={`form-check-label tipo-label ${tipoSeleccionado === "ADM" ? "activo" : ""}`}
                        htmlFor="tipoAdmin"
                    >
                        Admin
                    </label>
                </div>

                <div className="form-check form-check-inline" style={{ display: "flex", alignItems: "center" }}>
                    <input
                        className="form-check-input tipo-checkbox"
                        type="radio"
                        id="tipoNormal"
                        name="tipo"
                        value="NOR"
                        checked={tipoSeleccionado === "NOR"}
                        onChange={() => setFormData((prev) => ({ ...prev, tipo: "NOR" }))}
                    />
                    <label
                        className={`form-check-label tipo-label ${tipoSeleccionado === "NOR" ? "activo" : ""}`}
                        htmlFor="tipoNormal"
                    >
                        Normal
                    </label>
                </div>

                <div className="form-check form-check-inline" style={{ display: "flex", alignItems: "center" }}>
                    <input
                        className="form-check-input tipo-checkbox"
                        type="radio"
                        id="tipoEmpresa"
                        name="tipo"
                        value="EMP"
                        checked={tipoSeleccionado === "EMP"}
                        onChange={() => setFormData((prev) => ({ ...prev, tipo: "EMP" }))}
                    />
                    <label
                        className={`form-check-label tipo-label ${tipoSeleccionado === "EMP" ? "activo" : ""}`}
                        htmlFor="tipoEmpresa"
                    >
                        Empresa
                    </label>
                </div>
            </div>
        </div>
    );
};
