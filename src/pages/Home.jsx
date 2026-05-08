import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';

const Home = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');

  useEffect(() => {
    axiosInstance.get('/products')
      .then(res => {
        let data = res.data['hydra:member'] || res.data.member || res.data;
        if (Array.isArray(data)) setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des produits:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex justify-center mt-20">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  let filteredProducts = products.filter(p => 
    p.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (sortOrder === 'price-asc') {
    filteredProducts.sort((a, b) => a.prix - b.prix);
  } else if (sortOrder === 'price-desc') {
    filteredProducts.sort((a, b) => b.prix - a.prix);
  }

  return (
    <div>
      <h2 className="text-3xl font-black text-center mb-8 uppercase tracking-tighter text-white">
         <span className="text-purple-500 shadow-purple-500/50">Hardware</span> Disponibles
      </h2>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <label htmlFor="search-input" className="sr-only">Rechercher un produit</label>
        <input 
          id="search-input"
          type="text" 
          placeholder="Rechercher un produit..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Champ de recherche de produit"
          className="w-full md:w-1/2 bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 outline-none focus:border-purple-500 transition-colors"
        />

        <label htmlFor="sort-select" className="sr-only">Trier par prix</label>
        <select 
          id="sort-select"
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          aria-label="Sélecteur de tri"
          className="w-full md:w-1/4 bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 outline-none focus:border-purple-500 transition-colors cursor-pointer"
        >
          <option value="">Trier par prix</option>
          <option value="price-asc">Prix : Croissant</option>
          <option value="price-desc">Prix : Décroissant</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-purple-500/50 transition-all group relative overflow-hidden">
            
            {/* Effet de halo au survol */}
            <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-10 transition duration-500"></div>

            <div className="relative">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                {product.nom}
              </h3>
              <p className="text-slate-400 text-sm mb-6 line-clamp-2 italic">
                {product.description}
              </p>
              
              <div className="flex items-center gap-3 mb-6">
                <span className={`h-2 w-2 rounded-full ${product.stock_quantite > 0 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500'}`}></span>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  Stock: {product.stock_quantite}
                </span>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <span className="text-2xl font-black text-purple-400 italic" aria-label={`Prix: ${product.prix} euros`}>
                  {product.prix} €
                </span>
                <button 
                  onClick={() => addToCart(product)}
                  disabled={product.stock_quantite === 0}
                  aria-label={`Ajouter ${product.nom} au panier`}
                  className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-5 py-2 rounded-lg font-bold transition-all shadow-lg active:scale-90"
                >
                  AJOUTER
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;