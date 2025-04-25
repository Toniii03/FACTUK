import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios'; // Para realizar la petición a tu API

const FacturacionMensual = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Aquí deberías hacer una petición a tu API para obtener la facturación mensual
    axios.get('/api/facturacion-mensual')
      .then(response => {
        setData(response.data); // Asumiendo que la respuesta es un array de objetos con mes y total
      })
      .catch(error => {
        console.error('Error al cargar los datos de facturación mensual', error);
      });
  }, []); // Solo se ejecuta una vez cuando se monta el componente

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Total" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FacturacionMensual;
