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
            console.log("Respuesta de la API:", response.data);
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



export const servicioFacturas = {
    crearFactura,
    loadfacturas,
};
