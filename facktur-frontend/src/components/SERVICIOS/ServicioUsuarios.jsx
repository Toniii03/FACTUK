import axios from 'axios';

class ServicioUsuarios {
async crearUsuario(usuario) {
    try {
        const response = await axios.post('http://localhost:8080/auth/register', usuario, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const message = response.data?.message || 'Usuario registrado correctamente';
        return { status: 'ok', message };
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Ocurrió un error inesperado';
        return { status: 'error', message: errorMessage };
    }
}

    logout() {
        localStorage.clear();
    }
}

const servicioUsuarios = new ServicioUsuarios();
export default servicioUsuarios;
