
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Cart from './pages/Cart'; // 👈 1. On importe la nouvelle page

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`🛒 ${product.nom} a été ajouté à ton panier !`);
  };

  return (
    <Router>
      <nav style={{ padding: '20px', backgroundColor: '#282c34', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Accueil</Link>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Connexion</Link>
        <Link to="/admin" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>Admin</Link>
        
        {/* 👈 2. Le badge devient un LIEN CLIQUABLE vers /cart */}
        <Link to="/cart" style={{ backgroundColor: '#e74c3c', color: 'white', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', textDecoration: 'none' }}>
          🛒 Panier ({cart.length})
        </Link>
      </nav>

      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          {/* 👈 3. On ajoute la route pour le panier */}
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;