import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { PaginaHome } from './components/PAGINAS/PaginaHome';
import { PaginaLogin } from './components/LOGIN/PaginaLogin';
import { ProtectedRoute } from './components/AUTENTICACIONES/ProtectedRoute';
import { PaginaRegistro } from './components/LOGIN/PaginaRegistro';
import { Menu } from './components/MENU/Menu';
import { PaginaResumen } from './components/PAGINAS/PaginaResumen';
import { PaginaFacturas } from './components/PAGINAS/PaginaFacturas';
import { PaginaCrearFactura } from './components/PAGINAS/paginaCrearFactura';
import { PaginaPagos } from './components/PAGINAS/PaginaPagos';
import { PaginaGestionUsuarios } from './components/PAGINAS/PaginaGestionUsuarios';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MensajeErrores } from './components/MensajeErrores';
import { MensajeCorrectos } from './components/MensajeCorrectos';
import { MensajesProvider, useMensajes } from './context/MensajesContext';
import { MonedaProvider } from './components/COMPONENTES/MonedaContext';
import { PaginaFacturaDetalles } from './components/PAGINAS/PaginaFacturaDetalles';
import { ResetPassword } from './components/AUTENTICACIONES/ResetPassword';

function App() {
  const API_URL = process.env.REACT_APP_API_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const url = `${API_URL}auth/check`;
        const response = await axios.get(url, {
          withCredentials: true
        });
        setIsAuthenticated(response.status === 200);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <div className="mt-3 fs-5 fw-semibold text-primary">Cargando...</div>
        </div>
      </div>
    );

  return (
    <MensajesProvider>
      <MonedaProvider>
        <Router>
          <AppContent isAuthenticated={isAuthenticated} />
        </Router>
      </MonedaProvider>
    </MensajesProvider>
  );
}

const AppContent = ({ isAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { error, mensaje, cerrarError, cerrarMensaje } = useMensajes();

  const showMenu = !(location.pathname === '/auth/login' || location.pathname === '/auth/register' || location.pathname === '/forgot-password');

  useEffect(() => {
    if (isAuthenticated && (location.pathname === '/auth/login' || location.pathname === '/auth/register')) {
      navigate('/');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  return (
    <div className="App">
      {error && <MensajeErrores mensaje={error} onClose={cerrarError} />}
      {mensaje && <MensajeCorrectos mensaje={mensaje} onClose={cerrarMensaje} />}

      {showMenu && (
        <div className='div-menu'>
          <Menu />
        </div>
      )}

      <Routes>
        <Route path="/auth/login" element={<PaginaLogin />} />
        <Route path="/auth/register" element={<PaginaRegistro />} />
        <Route path="/forgot-password" element={<ResetPassword />} />
        <Route path="/" element={<PaginaHome />} />

        <Route path="/usuarios" element={<ProtectedRoute element={<PaginaGestionUsuarios />} />} />
        <Route path="/resumen" element={<ProtectedRoute element={<PaginaResumen />} />} />
        <Route path="/facturas" element={<ProtectedRoute element={<PaginaFacturas />} />} />
        <Route path="/factura/:id" element={<ProtectedRoute element={<PaginaFacturaDetalles />} />} />
        <Route path="/facturas/crear" element={<ProtectedRoute element={<PaginaCrearFactura />} />} />
        <Route path="/pagos" element={<ProtectedRoute element={<PaginaPagos />} />} />
      </Routes>
    </div>
  );
};

export default App;
