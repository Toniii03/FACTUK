import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { PaginaHome } from './components/PAGINAS/PaginaHome';
import { PaginaLogin } from './components/LOGIN/PaginaLogin';
import { ProtectedRoute } from './components/AUTENTICACIONES/ProtectedRoute';
import { PaginaRegistro } from './components/LOGIN/PaginaRegistro';
import { Menu } from './components/MENU/Menu';

function App() {
  const isAuthenticated = false;

  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} />
    </Router>
  );
}

const AppContent = ({ isAuthenticated }) => {
  // Usamos useLocation para obtener la ruta actual
  const location = useLocation();

  // Condición para no mostrar el menú en login y register
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

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute element={<PaginaHome />} isAuthenticated={isAuthenticated} />} />
      </Routes>
    </div>
  );
};

export default App;
