import { useState } from "react";
import "../../styles/Login/Login.css";
import logo from "../../logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import servicioUsuarios from "../SERVICIOS/ServicioUsuarios";
import { useMensajes } from "../../context/MensajesContext";
import axios from "axios";

export const PaginaLogin = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const { mostrarError, mostrarMensaje } = useMensajes();
  const navigate = useNavigate();
  const { login } = servicioUsuarios;

  const [nombreUsuario, setnombreUsuario] = useState("");
  const [password, setpassword] = useState("");
  const [cargandoRecuperacion, setCargandoRecuperacion] = useState(false);
  const [mostrarRecuperacion, setMostrarRecuperacion] = useState(false);
  const [correoRecuperacion, setCorreoRecuperacion] = useState("");

  const handleRecuperar = async () => {
    if (!correoRecuperacion) {
      mostrarError(
        "Introduce tu correo electrónico para recuperar la contraseña"
      );
      return;
    }

    setCargandoRecuperacion(true);
    try {
      const url = `${API_URL}auth/obtener-password`;
      await axios.post(url, null, {
        params: { email: correoRecuperacion },
        withCredentials: true,
      });
      mostrarMensaje("Correo de recuperación enviado");
      setMostrarRecuperacion(false);
      setCorreoRecuperacion("");
    } catch (error) {
      mostrarError("Error al enviar el correo de recuperación");
    } finally {
      setCargandoRecuperacion(false);
    }
  };

  const comprobarErrores = async (e) => {
    e.preventDefault();
    mostrarError("");

    if (nombreUsuario && password) {
      const result = await login(nombreUsuario, password);
      if (result.status === "ok") {
        mostrarMensaje("¡Inicio de sesión correcto!");
        navigate("/");
      } else {
        mostrarError(result.message || "Compruebe que el usuario y la contraseña son correctos");
      }
    } else {
      mostrarError("Por favor, completa todos los campos");
    }
  };

  return (
    <>
      <div className="Contenido-form">
        <div className="form d-flex">
          {/* Columna 1: Logo */}
          <div className="columna-logo d-flex justify-content-center align-items-center">
            <img src={logo} alt="Logo" className="logo-imagen" />
          </div>

          {/* Columna 2: Formulario */}
          <div className="columna-form">
            <h2>Inicio de Sesión</h2>
            <form onSubmit={comprobarErrores}>
              <div className="cuerpo-form">
                <div className="fila-form">
                  <input id="nombreUsuario" className="Input-Form-Login" type="text" value={nombreUsuario} onChange={(e) => setnombreUsuario(e.target.value)} placeholder="Correo electrónico" />
                </div>

                <div className="fila-form">
                  <input id="password" className="Input-Form-Login" type="password" value={password} onChange={(e) => setpassword(e.target.value)} placeholder="Contraseña" />
                </div>

                <div className="fila-form">
                  <button type="submit" className="boton-submit">
                    Entrar
                  </button>
                </div>

                <div className="fila-form-footer">
                  <div>
                    <label style={{color:'white'}}>¿No tienes cuenta?{" "}</label>
                    <Link className="enlace" to={"/auth/register"}>
                      Crear cuenta
                    </Link>
                  </div>
                  <div>
                    <button type="button" className="enlace btn-link" style={{ color: '#0d6efd' }} onClick={() => setMostrarRecuperacion(true)} >
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div >
      </div >

      {mostrarRecuperacion && (
        <div
          className="modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(51, 51, 51, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1050,
            padding: "1rem",
            boxSizing: "border-box",
          }}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="modal show fade"
            style={{
              top: "50%",
              maxWidth: "600px",
              width: "100%",
              overflowY: "auto",
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow: "0 8px 24px rgba(250, 196, 99, 0.5)",
              maxHeight: "fit-content",
            }}
          >
            <div
              className="modal-dialog"
              style={{
                width: "100%",
                maxHeight: "fit-content",
              }}
            >
              <div className="modal-content" style={{ minHeight: "300px" }}>
                <div
                  className="modal-header"
                  style={{
                    backgroundColor: "#FAC463",
                    color: "#333",
                    borderTopLeftRadius: "0.5rem",
                    borderTopRightRadius: "0.5rem",
                    padding: "1rem 1.5rem",
                    fontWeight: "700",
                    fontSize: "1.25rem",
                  }}
                >
                  <h5 className="modal-title">Recuperar contraseña</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={() => setMostrarRecuperacion(false)}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#333",
                      cursor: "pointer",
                    }}
                  ></button>
                </div>
                <div className="modal-body" style={{ padding: "1.5rem" }}>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Introduce tu correo"
                    value={correoRecuperacion}
                    onChange={(e) => setCorreoRecuperacion(e.target.value)}
                    style={{
                      border: "2px solid #FAC463",
                      borderRadius: "0.3rem",
                      padding: "0.5rem 1rem",
                      fontSize: "1rem",
                      outlineColor: "#FAC463",
                      width: "100%",
                    }}
                  />
                </div>
                <div
                  className="modal-footer"
                  style={{
                    padding: "1rem 1.5rem",
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "0.75rem",
                  }}
                >
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setMostrarRecuperacion(false)}
                    style={{
                      backgroundColor: "#333",
                      color: "#FAC463",
                      border: "none",
                      padding: "0.5rem 1rem",
                      cursor: "pointer",
                      fontWeight: "600",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#555")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "#333")
                    }
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleRecuperar}
                    disabled={cargandoRecuperacion}
                    style={{
                      backgroundColor: "#FAC463",
                      color: "#333",
                      border: "none",
                      padding: "0.5rem 1.5rem",
                      borderRadius: "0.3rem",
                      cursor: cargandoRecuperacion ? "not-allowed" : "pointer",
                      fontWeight: "700",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      !cargandoRecuperacion &&
                      (e.currentTarget.style.backgroundColor = "#e6b851")
                    }
                    onMouseLeave={(e) =>
                      !cargandoRecuperacion &&
                      (e.currentTarget.style.backgroundColor = "#FAC463")
                    }
                  >
                    {cargandoRecuperacion ? "Enviando..." : "Enviar correo"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
