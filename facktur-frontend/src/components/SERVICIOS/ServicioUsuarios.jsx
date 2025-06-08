import axios from "axios";
import Cookies from 'js-cookie';


const API_URL = process.env.REACT_APP_API_URL;

class ServicioUsuarios {

    async login(nombreUsuario, password) {
        try {
            const url = `${API_URL}/auth/login`;
            const response = await axios.post(url,
                { nombreUsuario, password },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            const { tipo, usuario } = response.data;

            localStorage.setItem('tipo', tipo);
            localStorage.setItem('usuario', JSON.stringify(usuario));

            Cookies.set('user', JSON.stringify(usuario), { secure: true, sameSite: 'Lax' });

            return { status: 'ok', message: 'Login exitoso' };
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                'Error desconocido al iniciar sesión';
            return { status: 'error', message: errorMessage };
        }
    }


    async loadUsuarios() {
        try {
            const url = `${API_URL}/auth/usuarios`;
            const response = await axios.get(url,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            )
            return response.data;
        } catch (error) {
            return error;
        }
    }


    async crearUsuario(usuario) {
        try {
            const url = `${API_URL}/auth/register`;
            const response = await axios.post(url, usuario, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            const message = response.data?.message || "Usuario registrado correctamente";
            return { status: "ok", message };
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Ocurrió un error inesperado";
            return { status: "error", message: errorMessage };
        }
    }

    async BuscarUsuarioPorId(idUsuario) {
        try {
            const url = `${API_URL}/auth/usuarios/${idUsuario}`;
            const response = await axios.get(url, {
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            return { status: "error", message: error.message };
        }
    }

    async ActualizarusuarioPorId(idUsuario, usuario) {
        try {
            const url = `${API_URL}/auth/usuario/${idUsuario}`;
            const response = await axios.put(url, usuario, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            return response.data;
        } catch (error) {
            return { status: "error", message: error.message };
        }
    }

    async EliminarUsuario(idUsuario) {
        try {
            const url = `${API_URL}/auth/usuarios/${idUsuario}`;
            await axios.delete(url, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            return "Usuario Eliminado correctamente";
        } catch (error) {
            return { status: "error", message: error.message };
        }
    }

    cambiarContrasena = async (idUsuario, nuevaContrasena) => {
        try {
            const url = `${API_URL}/auth/usuarios/${idUsuario}/cambiar-password`;
            await axios.put(url, {
                nuevaContrasena: nuevaContrasena.trim(),
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
        } catch (error) {
            throw new Error("Error al cambiar la contraseña");
        }
    };


    async logout() {
        try {
            const url = `${API_URL}/auth/logout`;
            await axios.post(url, null, {
                withCredentials: true
            });

            Cookies.remove('user');

            localStorage.removeItem('usuario');
            localStorage.removeItem('tipo');

            return { status: 'ok', message: 'Sesión cerrada' };
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                'Error al cerrar sesión';
            return { status: 'error', message: errorMessage };
        }
    }

}

const servicioUsuarios = new ServicioUsuarios();
export default servicioUsuarios;
