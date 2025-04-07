import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PaginaLogin } from './components/PaginaLogin';

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        
        {/* Ruta para la pagina de login */}
        <Route path='/auth/login' element={<PaginaLogin/>}></Route>

         {/* Esta página solo se puede acceder si está autenticado */}
        <Route
            path='/home'
            /*element={<ProtectedRoute> elemnto pagina  </ProtectedRoute> }*/
          />

      </Routes>
    </Router>

    </div>
  );
}

export default App;
