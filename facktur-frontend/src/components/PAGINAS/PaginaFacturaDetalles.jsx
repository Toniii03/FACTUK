import React, { useEffect, useState } from 'react';
import { servicioFacturas } from "../../components/SERVICIOS/servicioFacturas";
import { useParams } from 'react-router-dom';
import "../../styles/paginas/detallesFacturas.css"
import { useMoneda } from "../../components/COMPONENTES/MonedaContext";

export const PaginaFacturaDetalles = () => {
    const { moneda } = useMoneda();
    const { loadFacturaById, loadArticulosByFacturaId } = servicioFacturas;
    const [factura, setFactura] = useState(null);
    const [articulos, setArticulos] = useState([]);
    const { id } = useParams();

    const capitalizarPrimeraLetra = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const formatearPrecio = (cantidad, moneda) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: moneda,
        }).format(cantidad);
    };

    const formatearPrecioConCambio = (cantidad, moneda) => {
        const tasa = tasasCambio[moneda] || 1;
        const cantidadConvertida = cantidad * tasa;

        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: moneda,
        }).format(cantidadConvertida);
    };

    const tasasCambio = {
        EUR: 1,
        USD: 1.10,  // 1 EUR = 1.10 USD
        GBP: 0.85,  // 1 EUR = 0.85 GBP
    };


    useEffect(() => {
        const fetchFactura = async () => {
            try {
                const facturaData = await loadFacturaById(id);
                setFactura(facturaData);
                const articulosData = await loadArticulosByFacturaId(id);
                setArticulos(articulosData);
            } catch (error) {
                console.error('Error al cargar la factura:', error);
            }
        };

        fetchFactura();
    }, [id]);

    if (!factura) {
        return <div style={{ padding: '20px', fontSize: '1.2rem' }}>Cargando factura...</div>;
    }

    return (
        <div className="div-contentido">
            <div className="div_invisible"></div>
            <div className="div-visible" style={{ padding: "3rem" }}>
                <div className="pagina-factura-detalles">
                    <div className="container">
                        <h2 className="titulo-factura">Factura #{factura.numeroFactura}</h2>

                        <div className="datos-factura">
                            <div className={`dato-estado ${factura.estado === 'PENDIENTE' ? 'pendiente' : factura.estado === 'PAGADO' ? 'pagado' : 'cancelada' }`}>
                                <strong>Estado:</strong> <span>{factura.estado}</span>
                            </div>

                            <div className="dato">
                                <strong>Fecha Emisión:</strong> {new Date(factura.fechaEmision).toLocaleDateString()}
                            </div>
                            <div className="dato">
                                <strong>Fecha Límite de Pago:</strong> {new Date(factura.fechaLimitePago).toLocaleDateString()}
                            </div>
                            <div className="dato">
                                <strong>Usuario Receptor:</strong> {factura.usuarioReceptor}
                            </div>
                        </div>

                        <h3 className="titulo-articulos">Artículos</h3>
                        <table className="tabla-articulos">
                            <thead>
                                <tr>
                                    <th>Artículo</th>
                                    <th style={{ textAlign: 'center' }}>Cantidad</th>
                                    <th style={{ textAlign: 'center' }}>Precio Unitario</th>
                                    <th style={{ textAlign: 'center' }}>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articulos.map(({ id, articulo, cantidad, precioUnitario }) => (
                                    <tr key={id}>
                                        <td>{capitalizarPrimeraLetra(articulo)}</td>
                                        <td style={{ textAlign: 'center' }}>{cantidad}</td>
                                        <td style={{ textAlign: 'center' }}>{formatearPrecioConCambio(precioUnitario, moneda)}</td>
                                        <td style={{ textAlign: 'center' }}>{formatearPrecioConCambio(cantidad * precioUnitario, moneda)}</td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="totales">
                            <div className="total">
                                <strong>Total:</strong> {formatearPrecioConCambio(factura.total, moneda)}
                            </div>
                            <div className="total-pagado">
                                <strong>Total Pagado:</strong> {formatearPrecioConCambio(factura.totalPagado, moneda)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
