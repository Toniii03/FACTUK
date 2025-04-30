import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { PaginaHome } from './components/PAGINAS/PaginaHome';
import { PaginaLogin } from './components/LOGIN/PaginaLogin';
import { ProtectedRoute } from './components/AUTENTICACIONES/ProtectedRoute';
import { PaginaRegistro } from './components/LOGIN/PaginaRegistro';
import { Menu } from './components/MENU/Menu';
import { PaginaResumen } from './components/PAGINAS/PaginaResumen';
import { PaginaFacturas } from './components/PAGINAS/PaginaFacturas';
import { PaginaPagos } from './components/PAGINAS/PaginaPagos';

function App() {
  const isAuthenticated = false;

  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} />
    </Router>
  );
}

const AppContent = ({ isAuthenticated }) => {

  const location = useLocation();
  const showMenu = !(location.pathname === '/auth/login' || location.pathname === '/auth/register');

  return (
    <div className="App">
      {/* Solo mostrar el menú si no estamos en login o registro */}
      {showMenu && (
        <div className='div-menu'>
          <Menu />
        </div>
      )}

      <Routes>
        {/* Ruta Sin autentificación */}
        <Route path="/auth/login" element={<PaginaLogin />} />
        <Route path="/auth/register" element={<PaginaRegistro />} />
        <Route path="/" element={<PaginaHome />} />

        {/* Cambiar estas rutas a protegidas */}
        <Route path="/resumen" element={<PaginaResumen />} />
        <Route path="/facturas" element={<PaginaFacturas />} />
        <Route path="/pagos" element={<PaginaPagos />} />

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute element={<PaginaHome />} isAuthenticated={isAuthenticated} />} />

        
      </Routes>
    </div>
  );
};

export default App;
