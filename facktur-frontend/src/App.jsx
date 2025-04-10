import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PaginaHome } from './components/HOME/PaginaHome';
import { PaginaLogin } from './components/LOGIN/PaginaLogin';
import { ProtectedRoute } from './components/AUTENTICACIONES/ProtectedRoute'
import { PaginaRegistro } from './components/LOGIN/PaginaRegistro';

function App() {

  const isAuthenticated = false

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Ruta Sin autentificacion */}
          <Route path="/auth/login" element={<PaginaLogin />} />
          <Route path="/auth/register" element={<PaginaRegistro />} />
          <Route path="/" element={<PaginaHome/>} />
          
          {/* Rutas Protegidas ( element={<ProtectedRoute element={<PaginaHome />} isAuthenticated={isAuthenticated} />} ) />*/ }
          <Route element={<ProtectedRoute element={""} isAuthenticated={isAuthenticated} />}  />

        </Routes>
      </Router>
    </div>
  );
}

export default App;
