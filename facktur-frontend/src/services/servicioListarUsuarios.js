import axios from "axios"

const URL_REST_FACKTUR = "http://localhost:8081/auth/login"

class ServicioListarUsuarios{

    ObtenerTodosUsuarios(){
        return axios.get(URL_REST_FACKTUR)
    }
}

export default new ServicioListarUsuarios();