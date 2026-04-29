import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AdminProducts from './pages/AdminProducts';
import Cart from './pages/Cart';
import Event from './pages/Event';
import AdminEvents from './pages/AdminEvents';
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
    console.log('🔄 APP INIT - Token:', token ? 'OUI' : 'NON');
    console.log('🔄 APP INIT - Rôles du localStorage:', roles);
    if (token) {
      setAuthToken(token);
      setIsAuthenticated(true);
      setUserRoles(roles);
      console.log('✅ APP INIT - Authentifié avec rôles:', roles);
      console.log('✅ APP INIT - Est Admin?', roles.includes('ROLE_ADMIN') ? 'OUI ✅' : 'NON ❌');
    }
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const handleLoginSuccess = (token, roles = []) => {
    console.log('📝 HANDLE LOGIN SUCCESS - Token:', token?.substring(0, 20) + '...');
    console.log('📝 HANDLE LOGIN SUCCESS - Rôles reçus:', roles);
    setAuthToken(token);
    setIsAuthenticated(true);
    setUserRoles(roles);
    localStorage.setItem('userRoles', JSON.stringify(roles));
    console.log('✅ HANDLE LOGIN SUCCESS - Rôles stockés dans localStorage:', roles);
    console.log('✅ HANDLE LOGIN SUCCESS - Est Admin?', roles.includes('ROLE_ADMIN') ? 'OUI ✅' : 'NON ❌');
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
          <Link to={isAuthenticated ? "/home" : "/"} className="text-purple-500 font-black text-2xl uppercase tracking-widest hover:text-purple-400 transition-colors whitespace-nowrap">
            💻 BOUTIQUE
          </Link>

          {/* CENTRE - Liens de navigation */}
          <div className="flex justify-center items-center gap-8 flex-1">
            <Link to={isAuthenticated ? "/home" : "/"} className="text-slate-300 font-bold hover:text-purple-400 transition-all uppercase tracking-widest text-sm hover:tracking-[0.2em]">
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
                <Link to="/events" className="text-slate-300 font-bold hover:text-purple-400 transition-all uppercase tracking-widest text-sm">
                  🔧 Événement
                </Link>
                <Link to="/profile" className="text-slate-300 font-bold hover:text-purple-400 transition-all uppercase tracking-widest text-sm">
                  Mon Profil
                </Link>
                {userRoles && userRoles.includes('ROLE_ADMIN') && (
                  <Link 
                    to="/admin" 
                    className="bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 font-black border border-blue-500/40 hover:border-blue-500 px-4 py-2 rounded-lg transition-all uppercase tracking-widest text-sm shadow-lg shadow-blue-500/20"
                  >
                    ⚙️ ADMIN DASHBOARD
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
                className="text-slate-300 hover:text-red-400 transition-all px-3 py-2 hover:bg-slate-800/50 rounded-lg font-bold text-sm uppercase"
                title="Se déconnecter"
              >
                🚪 Logout
              </button>
            )}
          </div>

        </div>
      </nav>

      {/* Conteneur principal */}
      <main className="container mx-auto mt-10 p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home addToCart={addToCart} />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register onRegisterSuccess={handleLoginSuccess} />} />
          <Route path="/events" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Event />} />} />
          <Route path="/admin" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Admin />} requiredRole="ROLE_ADMIN" userRoles={userRoles} />} />
          <Route path="/admin/products" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<AdminProducts />} requiredRole="ROLE_ADMIN" userRoles={userRoles} />} />
          <Route path="/admin/events" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<AdminEvents />} requiredRole="ROLE_ADMIN" userRoles={userRoles} />} />
          <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated} element={<Profile />} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;