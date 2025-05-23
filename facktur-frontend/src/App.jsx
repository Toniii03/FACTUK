import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { PaginaHome } from './components/PAGINAS/PaginaHome';
import { PaginaLogin } from './components/LOGIN/PaginaLogin';
import { ProtectedRoute } from './components/AUTENTICACIONES/ProtectedRoute';
import { PaginaRegistro } from './components/LOGIN/PaginaRegistro';
import { Menu } from './components/MENU/Menu';
import { PaginaResumen } from './components/PAGINAS/PaginaResumen';
import { PaginaFacturas } from './components/PAGINAS/PaginaFacturas';
import { PaginaCrearFactura }  from './components/PAGINAS/paginaCrearFactura';
import { PaginaPagos } from './components/PAGINAS/PaginaPagos';
import { PaginaGestionUsuarios } from './components/PAGINAS/PaginaGestionUsuarios';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { MensajeErrores } from './components/MensajeErrores';
import { MensajeCorrectos } from './components/MensajeCorrectos';
import { MensajesProvider, useMensajes } from './context/MensajesContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:8080/auth/check', {
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

  if (loading) return <div>Cargando...</div>;

  return (
    <MensajesProvider>
      <Router>
        <AppContent isAuthenticated={isAuthenticated} />
      </Router>
    </MensajesProvider>
  );
}

const AppContent = ({ isAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { error, mensaje, cerrarError, cerrarMensaje } = useMensajes();

  const showMenu = !(location.pathname === '/auth/login' || location.pathname === '/auth/register');

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
        <Route path="/" element={<PaginaHome />} />
        <Route path="/usuarios" element={<ProtectedRoute element={<PaginaGestionUsuarios />} />} />
        <Route path="/resumen" element={<ProtectedRoute element={<PaginaResumen />} />} />
        <Route path="/facturas" element={<ProtectedRoute element={<PaginaFacturas />} />} />
        <Route path="/facturas/crear" element={<ProtectedRoute element={<PaginaCrearFactura />} />} />
        <Route path="/pagos" element={<ProtectedRoute element={<PaginaPagos />} />} />
      </Routes>
    </div>
  );
};

export default App;
