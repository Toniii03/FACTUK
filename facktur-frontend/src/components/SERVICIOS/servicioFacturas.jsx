// src/services/servicioFacturas.js
import axios from "axios";

const API_URL = "http://localhost:8080/";

const loadfacturas = async () => {
    try {
        const url = `${API_URL}facturas`;
        const response = await axios.get(url,
            {
                withCredentials: true
            });
        return response.data;
    } catch (error) {
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
