import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login'; // 👈 On importe notre nouvelle page !
import Home from './pages/Home';

// Faux composants en attendant de créer les vrais
const Admin = () => <h2 style={{ textAlign: 'center', marginTop: '50px' }}>🛡️ Tableau de Bord Admin (Privé)</h2>;

function App() {
  return (
    <Router>
      <nav style={{ padding: '20px', backgroundColor: '#282c34', display: 'flex', justifyContent: 'center', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Accueil</Link>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Connexion</Link>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Admin</Link>
      </nav>

      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;