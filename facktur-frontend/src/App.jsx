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
  const isAuthenticated = !!localStorage.getItem("token");

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
          {/* Rutas públicas */}
          <Route path="/auth/login" element={<PaginaLogin />} />
          <Route path="/auth/register" element={<PaginaRegistro />} />
          <Route path="/" element={<PaginaHome />} />

          {/* Rutas protegidas */}
          <Route path="/resumen" element={<ProtectedRoute element={<PaginaResumen />} />} />
          <Route path="/facturas" element={<ProtectedRoute element={<PaginaFacturas />} />} />
          <Route path="/pagos" element={<ProtectedRoute element={<PaginaPagos />} />} />
        </Routes>
      </div>
    );
};

export default App;
