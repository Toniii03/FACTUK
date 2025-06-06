import axios from "axios";
import Cookies from 'js-cookie';

const API_URL = process.env.REACT_APP_API_URL;

const loadfacturas = async () => {
    try {
        const userCookie = Cookies.get('user');
        if (!userCookie) throw new Error("Usuario no autenticado");

        const user = JSON.parse(userCookie);
        const url = `${API_URL}facturas`;

        const response = await axios.get(url, {
            withCredentials: true
        });

        if (user.tipo === "admin" || user.cargo === "admin" || user.rol === "admin") {
            return response.data;
        }

        const facturasFiltradas = response.data.filter(factura =>
            factura.usuario?.id === user.id
        );

        return facturasFiltradas;

    } catch (error) {
        console.error("Error cargando facturas:", error);
        throw error.response?.data?.mensaje || "Error al obtener las facturas.";
    }
};

const crearFactura = async (datosFactura) => {
    try {
        const url = `${API_URL}facturas/crear`;
        const response = await axios.post(url, datosFactura, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.mensaje || "Error al crear la factura.";
    }
};

const editarFactura = async (id, datosFactura) => {
    try {
        const url = `${API_URL}facturas/editar/${id}`;
        const response = await axios.put(url, datosFactura, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.mensaje || "Error al editar la factura.";
    }
}

const eliminarFactura = async (id) => {
    try {
        const url = `${API_URL}facturas/eliminar/${id}`;
        const response = await axios.delete(url, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.mensaje || "Error al eliminar la factura.";
    }
}

const loadFacturaById = async (id) => {
    try {
        const url = `${API_URL}facturas/${id}`;
        const response = await axios.get(url, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.mensaje || "Error al buscar la factura.";
    }
}

const loadArticulosByFacturaId = async (id) => {
    try {
        const url = `${API_URL}facturas/${id}/articulos`;
        const response = await axios.get(url, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.mensaje || "Error al buscar la factura.";
    }
}



export const servicioFacturas = {
    crearFactura,
    loadfacturas,
    editarFactura,
    eliminarFactura,
    loadFacturaById,
    loadArticulosByFacturaId
};
