import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Cart from './pages/Cart';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <Router>
      {/* Navbar avec effet "Glassmorphism" */}
      <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-50 flex justify-center items-center gap-10">
        
        {/* On remplace hover:text-cyan-400 par hover:text-purple-400 */}
        <Link to="/" className="text-slate-300 font-bold hover:text-purple-400 transition-all uppercase tracking-widest text-sm hover:tracking-[0.2em]">
          Accueil
        </Link>
        <Link to="/login" className="text-slate-300 font-bold hover:text-purple-400 transition-all uppercase tracking-widest text-sm">
          Connexion
        </Link>
        <Link to="/admin" className="text-slate-300 font-bold hover:text-purple-400 transition-all uppercase tracking-widest text-sm">
          Admin
        </Link>
        
        
        <Link to="/cart" className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-black shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all hover:scale-105 active:scale-95">
          🛒 PANIER ({cart.length})
        </Link>

      </nav>

      {/* Conteneur principal */}
      <main className="container mx-auto mt-10 p-4">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;