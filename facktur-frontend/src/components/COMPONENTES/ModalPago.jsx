import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useMensajes } from '../../context/MensajesContext';

export default function ModalPago({ factura, usuarioId, isOpen, onClose, onPagoRealizado }) {
    const { mostrarError, mostrarMensaje } = useMensajes();

    const API_URL = process.env.REACT_APP_API_URL;

    if (!isOpen || !factura) return null;

    const restante = factura.total - factura.totalPagado;

    const schema = Yup.object().shape({
        montoPagado: Yup.number()
            .required('Este campo es obligatorio')
            .positive('Debe ser mayor que 0')
            .max(restante, `No puedes pagar más de ${restante.toFixed(2)} €`),
        metodoPago: Yup.string().required('Este campo es obligatorio'),

    });

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const payload = {
                usuarioId: JSON.parse(localStorage.getItem('usuario'))?.id,
                facturaId: factura.id,
                montoPagado: values.montoPagado,
                metodoPago: values.metodoPago,
            };
            const url = `${API_URL}pagos`;
            await axios.post(url, payload, {
                withCredentials: true,
            });
            onPagoRealizado();
            resetForm();
            onClose();
            mostrarMensaje("Pago registrado correctamente.");
        } catch (error) {
            if (error.response) {
                mostrarError('Error en el servidor');
            } else {
                mostrarError('Error al registrar el pago');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="container my-4 p-4 bg-white rounded shadow" style={{ maxWidth: '600px', color: '#333' }}>
            <h2 className="mb-4 fw-bold" style={{ color: '#333' }}>Registrar pago</h2>

            <Formik
                initialValues={{ montoPagado: '', metodoPago: '' }}
                validationSchema={schema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, setFieldValue }) => (
                    <Form>
                        {/* Importe */}
                        <div className="mb-4">
                            <label htmlFor="montoPagado" className="form-label fw-semibold" style={{ color: '#333' }}>
                                Importe a pagar
                            </label>
                            <Field
                                name="montoPagado"
                                type="number"
                                min="0"
                                step="0.01"
                                value={values.montoPagado}
                                onChange={e =>
                                    setFieldValue('montoPagado', e.target.value ? parseFloat(e.target.value) : '')
                                }
                                className="form-control"
                            />
                            <ErrorMessage
                                name="montoPagado"
                                component="div"
                                className="form-text text-danger mt-1"
                            />
                            <div className="form-text mt-1">
                                Importe restante: <strong>{restante.toFixed(2)} €</strong>
                            </div>
                        </div>

                        {/* Método */}
                        <div className="mb-4">
                            <label htmlFor="metodoPago" className="form-label fw-semibold" style={{ color: '#333' }}>
                                Método de pago <span className="text-muted fw-normal">(opcional)</span>
                            </label>
                            <Field
                                name="metodoPago"
                                type="text"
                                placeholder="Transferencia, efectivo, etc."
                                className="form-control"
                            />
                        </div>

                        {/* Botones */}
                        <div className="d-flex justify-content-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-outline-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn"
                                style={{
                                    backgroundColor: '#FAC463',
                                    color: '#333',
                                    fontWeight: 'bold',
                                    border: 'none',
                                }}
                            >
                                {isSubmitting ? 'Procesando...' : 'Pagar'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
