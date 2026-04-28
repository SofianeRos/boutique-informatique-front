import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [cart, setCart] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

  // Vérifier si un token existe au chargement
  useEffect(() => {
    const token = localStorage.getItem('token');
    const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
      setUserRoles(roles);
    }
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const handleLoginSuccess = (token, roles = []) => {
    setAuthToken(token);
    setIsAuthenticated(true);
    setUserRoles(roles);
    localStorage.setItem('userRoles', JSON.stringify(roles));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoles');
    setAuthToken(null);
    setIsAuthenticated(false);
    setUserRoles([]);
    window.location.href = '/';
  };

  return (
    <Router>
      {/* Navbar avec effet "Glassmorphism" */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          
          {/* GAUCHE - Logo */}
          <Link to="/" className="text-purple-500 font-black text-2xl uppercase tracking-widest hover:text-purple-400 transition-colors whitespace-nowrap">
            💻 BOUTIQUE
          </Link>

          {/* CENTRE - Liens de navigation */}
          <div className="flex justify-center items-center gap-8 flex-1">
            <Link to="/" className="text-slate-300 font-bold hover:text-purple-400 transition-all uppercase tracking-widest text-sm hover:tracking-[0.2em]">
              Accueil
            </Link>
            
            {/* Links Auth - Affichés seulement si pas connecté */}
            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-slate-300 font-bold hover:text-purple-400 transition-all uppercase tracking-widest text-sm">
                  Connexion
                </Link>
                <Link to="/register" className="text-slate-300 font-bold hover:text-purple-400 transition-all uppercase tracking-widest text-sm">
                  Inscription
                </Link>
              </>
            )}

            {/* Admin - Visible seulement si connecté ET admin */}
            {isAuthenticated && (
              <>
                <Link to="/profile" className="text-slate-300 font-bold hover:text-purple-400 transition-all uppercase tracking-widest text-sm">
                  Mon Profil
                </Link>
                {userRoles && userRoles.includes('ROLE_ADMIN') && (
                  <Link to="/admin" className="text-orange-400 font-black hover:text-orange-300 transition-all uppercase tracking-widest text-sm">
                    ⚙️ Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* DROITE - Panier et Logout */}
          <div className="flex items-center gap-4 whitespace-nowrap">
            <Link to="/cart" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-black shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:scale-105 active:scale-95">
              🛒 PANIER ({cart.length})
            </Link>

            {/* Bouton Logout - Affiche seulement si connecté */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-slate-300 hover:text-red-400 transition-all p-2 hover:bg-slate-800/50 rounded-lg"
                title="Se déconnecter"
              >
                {/* SVG Logout */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            )}
          </div>

        </div>
      </nav>

      {/* Conteneur principal */}
      <main className="container mx-auto mt-10 p-4">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onRegisterSuccess={handleLoginSuccess} />} />
          <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Profile />} />} />
          <Route path="/admin" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Admin />} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;