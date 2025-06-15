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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const API_URL = process.env.REACT_APP_API_URL;

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Aquí recalculamos los importes pendientes ajustados para tabla y gráfico
  const importeTotalMes = data.reduce((acc, item) => acc + item.totalPagado + (item.totalPendiente ?? 0), 0);
  let acumuladoPagado = 0;
  const dataAjustada = data.map(item => {
    acumuladoPagado += item.totalPagado;
    return {
      ...item,
      totalPendienteAjustado: importeTotalMes - acumuladoPagado
    };
  });

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`Semana: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {(entry.name.toLowerCase().includes('dinero') ||
                entry.name.toLowerCase().includes('pagado') ||
                entry.name.toLowerCase().includes('pendiente'))
                ? `${entry.name}: €${entry.value.toFixed(2)}`
                : `${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container-resumen">
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
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={isMobile ? 300 : 360}>
              <LineChart 
                data={dataAjustada} 
                margin={{ 
                  top: 20, 
                  right: isMobile ? 10 : 30, 
                  left: isMobile ? 10 : 20, 
                  bottom: isMobile ? 20 : 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis 
                  dataKey="semana" 
                  tick={{ fill: '#555', fontSize: isMobile ? 11 : 13 }} 
                  label={!isMobile ? { value: 'Semana', position: 'insideBottom', offset: -5 } : undefined}
                  interval={isMobile ? 'preserveStartEnd' : 0}
                />
                <YAxis 
                  tick={{ fill: '#555', fontSize: isMobile ? 10 : 13 }} 
                  width={isMobile ? 40 : 60}
                />
                <Tooltip content={customTooltip} />
                <Legend 
                  verticalAlign="top" 
                  height={isMobile ? 60 : 36} 
                  wrapperStyle={{ 
                    fontWeight: '700', 
                    fontSize: isMobile ? 12 : 15,
                    lineHeight: isMobile ? '1.2' : 'normal'
                  }}
                  iconSize={isMobile ? 12 : 18}
                />
                <Line 
                  type="monotone" 
                  dataKey="pendientes" 
                  stroke="#dc3545" 
                  name="Facturas sin pagar (cantidad)" 
                  strokeWidth={isMobile ? 2 : 3} 
                  activeDot={{ r: isMobile ? 6 : 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="pagadas" 
                  stroke="#007bff" 
                  name="Facturas pagadas (cantidad)" 
                  strokeWidth={isMobile ? 2 : 3} 
                  activeDot={{ r: isMobile ? 6 : 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="totalPagado" 
                  stroke="#28a745" 
                  name="Dinero pagado (€)" 
                  strokeWidth={isMobile ? 2 : 3} 
                  activeDot={{ r: isMobile ? 6 : 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="totalPendienteAjustado" 
                  stroke="#ffc107" 
                  name="Dinero pendiente (€)" 
                  strokeWidth={isMobile ? 2 : 3} 
                  activeDot={{ r: isMobile ? 6 : 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="table-wrapper">
            <table className="table-facturacion">
              <thead>
                <tr>
                  <th>Semana</th>
                  <th>Pagadas</th>
                  <th>Pendientes</th>
                  <th>€ Pagado</th>
                  <th>€ Pendiente</th>
                </tr>
              </thead>
              <tbody>
                {dataAjustada.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.semana}</td>
                    <td>{item.pagadas}</td>
                    <td>{item.pendientes}</td>
                    <td>€{item.totalPagado.toFixed(2)}</td>
                    <td>€{item.totalPendienteAjustado.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default FacturacionMensual;
