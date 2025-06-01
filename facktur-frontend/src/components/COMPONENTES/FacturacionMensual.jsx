import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import '../../styles/paginas/GraficoFacturas.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const FacturacionMensual = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
  const navigate = useNavigate();

  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(currentMonth);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = "http://localhost:8080/";

  const years = [];
  for (let y = 2020; y <= currentYear + 1; y++) {
    years.push(y.toString());
  }

  const months = [
    { value: '01', name: 'Enero' },
    { value: '02', name: 'Febrero' },
    { value: '03', name: 'Marzo' },
    { value: '04', name: 'Abril' },
    { value: '05', name: 'Mayo' },
    { value: '06', name: 'Junio' },
    { value: '07', name: 'Julio' },
    { value: '08', name: 'Agosto' },
    { value: '09', name: 'Septiembre' },
    { value: '10', name: 'Octubre' },
    { value: '11', name: 'Noviembre' },
    { value: '12', name: 'Diciembre' },
  ];

  const cargarDatos = () => {
    setLoading(true);
    setError(null);

    const start = `${year}-${month}-01`;
    const lastDay = getLastDayOfMonth(parseInt(year), parseInt(month));
    const end = `${year}-${month}-${lastDay.toString().padStart(2, '0')}`;

    const userCookie = Cookies.get('user');
    if (!userCookie) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userCookie);
    const userId = user?.id;

    axios.get(`${API_URL}facturacion-mensual`, {
      params: { start, end, userId },
      withCredentials: true
    })
      .then(response => setData(response.data))
      .catch(error => {
        if (error.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Error al cargar datos de facturación mensual');
        }
      })
      .finally(() => setLoading(false));
  };


  const getLastDayOfMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  useEffect(() => {
    cargarDatos();
  }, [year, month]);

  return (
    <div className="container">
      <div className="form-row">
        <div className="input-wrapper">
          <label htmlFor="year-select" className="label">Año</label>
          <select
            id="year-select"
            value={year}
            onChange={e => setYear(e.target.value)}
            className="select"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="input-wrapper">
          <label htmlFor="month-select" className="label">Mes</label>
          <select
            id="month-select"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="select"
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.name}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="loading-text">Cargando datos...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p className="no-data-text">No existen datos en estas fechas.</p>
      )}

      {!loading && !error && data.length > 0 && (
        <>
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="semana" tick={{ fill: '#555', fontSize: 13 }} label={{ value: 'Semana', position: 'insideBottom', offset: -5 }} />
              <YAxis tick={{ fill: '#555', fontSize: 13 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', borderRadius: 8, borderColor: '#ccc' }}
                itemStyle={{ color: '#222', fontWeight: '600' }}
                labelStyle={{ fontWeight: '700' }}
                formatter={(value, name) => {
                  if (name.toLowerCase().includes('dinero') || name.toLowerCase().includes('pagado') || name.toLowerCase().includes('pendiente')) {
                    return [`€ ${value.toFixed(2)}`, name];
                  }
                  return [value, name];
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontWeight: '700', fontSize: 15 }} />
              <Line type="monotone" dataKey="pendientes" stroke="#dc3545" name="Facturas sin pagar (cantidad)" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="pagadas" stroke="#007bff" name="Facturas pagadas (cantidad)" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="totalPagado" stroke="#28a745" name="Dinero pagado (€)" strokeWidth={3} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="totalPendiente" stroke="#ffc107" name="Dinero pendiente (€)" strokeWidth={3} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>

          <table className="table-facturacion">
            <thead>
              <tr>
                <th>Semana</th>
                <th>Facturas Pagadas</th>
                <th>Facturas Pendientes</th>
                <th>Total Pagado (€)</th>
                <th>Total Pendiente (€)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.semana}</td>
                  <td>{item.pagadas}</td>
                  <td>{item.pendientes}</td>
                  <td>€ {item.totalPagado.toFixed(2)}</td>
                  <td>€ {item.totalPendiente.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default FacturacionMensual;
