import axios from "axios";

class ServicioUsuarios {


    async login(nombreUsuario, password) {
    try {
        const response = await axios.post(
            'http://localhost:8080/auth/login',
            { nombreUsuario, password },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        )
        
        const { tipo, usuario } = response.data;
        localStorage.setItem('tipo', tipo);
        localStorage.setItem('usuario', JSON.stringify(usuario));

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


    async crearUsuario(usuario) {
        try {
            const response = await axios.post('http://localhost:8080/auth/register', usuario, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            const message =
                response.data?.message || "Usuario registrado correctamente";
            return { status: "ok", message };
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "Ocurrió un error inesperado";
            return { status: "error", message: errorMessage };
        }
    }

    logout() {
        localStorage.clear();
        axios.post('http://localhost:8080/auth/logout', {}, {
            withCredentials: true
        });
    }
}

const servicioUsuarios = new ServicioUsuarios();
export default servicioUsuarios;
