import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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

  const [mostrarRecuperacion, setMostrarRecuperacion] = useState(false);
  const [usuarioRecuperacion, setUsuarioRecuperacion] = useState("");
  const [cargandoRecuperacion, setCargandoRecuperacion] = useState(false);

  const esquemaValidacion = Yup.object().shape({
    nombreUsuario: Yup.string().required("El nombre de usuario es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    mostrarError("");
    const result = await login(values.nombreUsuario, values.password);
    if (result.status === "ok") {
      mostrarMensaje("¡Inicio de sesión correcto!");
      navigate("/");
    } else {
      mostrarError(
        result.message || "Compruebe que el usuario y la contraseña son correctos"
      );
    }
    setSubmitting(false);
  };

  const handleRecuperar = async () => {
    if (!usuarioRecuperacion) {
      mostrarError("Introduce tu nombre de usuario para recuperar la contraseña");
      return;
    }

    setCargandoRecuperacion(true);
    try {
      const url = `${API_URL}auth/obtener-password`;
      await axios.post(
        url,
        null,
        {
          params: { username: usuarioRecuperacion },
          withCredentials: true,
        }
      );
      mostrarMensaje("Correo de recuperación enviado");
      setMostrarRecuperacion(false);
      setUsuarioRecuperacion("");
    } catch (error) {
      mostrarError("Error al enviar el correo de recuperación");
    } finally {
      setCargandoRecuperacion(false);
    }
  };

  return (
    <>
      <div className="Contenido-form">
        <div className="form d-flex">
          <div className="columna-logo d-flex justify-content-center align-items-center">
            <img src={logo} alt="Logo" className="logo-imagen" />
          </div>

          <div className="columna-form">
            <h2>Inicio de Sesión</h2>
            <Formik
              initialValues={{ nombreUsuario: "", password: "" }}
              validationSchema={esquemaValidacion}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="cuerpo-form">
                  <div className="fila-form">
                    <Field
                      type="text"
                      name="nombreUsuario"
                      className="Input-Form-Login"
                      placeholder="Nombre de usuario"
                    />
                    <ErrorMessage
                      name="nombreUsuario"
                      component="div"
                      className="text-danger small mt-1"
                    />
                  </div>

                  <div className="fila-form">
                    <Field
                      type="password"
                      name="password"
                      className="Input-Form-Login"
                      placeholder="Contraseña"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger small mt-1"
                    />
                  </div>

                  <div className="fila-form">
                    <button type="submit" className="boton-submit" disabled={isSubmitting}>
                      Entrar
                    </button>
                  </div>

                  <div className="fila-form-footer">
                    <div>
                      <label>¿No tienes cuenta? </label>
                      <Link className="enlace" to={"/auth/register"}>
                        Crear cuenta
                      </Link>
                    </div>
                    <div>
                      <button
                        type="button"
                        className="enlace btn-link"
                        style={{ color: "#0d6efd" }}
                        onClick={() => setMostrarRecuperacion(true)}
                      >
                        <label htmlFor="">¿Olvidaste tu contraseña?</label>
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {mostrarRecuperacion && (
        <div
          className="modal-overlay"
          style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(51, 51, 51, 0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1050, padding: "1rem", boxSizing: "border-box", }}
          tabIndex={-1}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="modal show fade"
            style={{ maxHeight: "50%",top: "50%" }}
          >
            <div className="modal-dialog" style={{ width: "100%" }}>
              <div className="modal-content" style={{ minHeight: "300px" }}>
                <div
                  className="modal-header"
                >
                  <h5 className="modal-title">Recuperar contraseña</h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={() => setMostrarRecuperacion(false)}
                    style={{ backgroundColor: "transparent", border: "none", fontSize: "1.5rem", fontWeight: "700", color: "#333",cursor: "pointer", }}
                  ></button>
                </div>
                <div className="modal-body" style={{ maxHeight: "200px", }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Introduce tu Correo electrónico"
                    value={usuarioRecuperacion}
                    onChange={(e) => setUsuarioRecuperacion(e.target.value)}
                    style={{ border: "2px solid #FAC463", borderRadius: "0.3rem", padding: "0.5rem 1rem", fontSize: "1rem", outlineColor: "#FAC463",width: "100%",}}
                  />
                </div>
                <div
                  className="modal-footer"
                  style={{ padding: "1rem 1.5rem", display: "flex", justifyContent: "flex-end",gap: "0.75rem", }}
                >
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setMostrarRecuperacion(false)}
                    style={{ backgroundColor: "#333",color: "#FAC463", border: "none", padding: "0.5rem 1rem", cursor: "pointer", fontWeight: "600", transition: "background-color 0.3s ease", }}
                  >
                    Cancelar
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleRecuperar}
                    disabled={cargandoRecuperacion}
                    style={{ backgroundColor: "#FAC463", color: "#333", border: "none", padding: "0.5rem 1.5rem", borderRadius: "0.3rem", cursor: cargandoRecuperacion ? "not-allowed" : "pointer", fontWeight: "700", transition: "background-color 0.3s ease",
                    }}
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
