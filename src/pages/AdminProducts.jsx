import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../services/axiosConfig';

// 📋 CATALOGUE 
const COMPONENT_CATEGORIES = {
  "Processeur": ["Intel i5-14600K", "Intel i7-14700K", "Intel i9-14900K", "AMD Ryzen 7 7800X3D", "AMD Ryzen 9 7950X3D"],
  "Carte Graphique": ["RTX 4060 Ti (8Go)", "RTX 4070 Super (12Go)", "RTX 4080 Super (16Go)", "RTX 4090 (24Go)", "RX 7900 XTX (24Go)"],
  "Carte Mère": ["MSI B760 Gaming", "ASUS ROG Strix Z790", "Gigabyte X670E Aorus"],
  "Mémoire RAM": ["16 Go DDR5 5200MHz", "32 Go DDR5 6000MHz CL30", "64 Go DDR5 RGB 6400MHz"],
  "Stockage M.2": ["1 To NVMe Gen4", "2 To NVMe Gen4 HighSpeed", "4 To NVMe Gen4"],
  "Refroidissement": ["AirCooler Be Quiet!", "AIO 240mm RGB", "AIO 360mm LCD Screen"],
  "Alimentation": ["750W 80+ Gold", "850W 80+ Gold Modulaire", "1000W 80+ Platinum", "1200W PCIe 5.0"],
  "Boîtier & OS": ["Boîtier Flux d'air", "Boîtier Full Verre Trempé", "Windows 11 Pro installé", "Pack LED RGB Corsair"]
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedComps, setSelectedComps] = useState([]);
  const [newProduct, setNewProduct] = useState({ nom: '', prix: '', description: '', stock_quantite: 1 });

  const fetchProducts = useCallback(() => {
    axiosInstance.get('/products')
    .then(res => {
      let data = res.data['hydra:member'] || res.data.member || res.data;
      if (Array.isArray(data)) setProducts(data);
    })
    .catch(err => console.error("Erreur API", err));
  }, []);

  useEffect(() => { 
    fetchProducts(); 
  }, [fetchProducts]);

  const handleCheck = (comp) => {
    let updatedComps = selectedComps.includes(comp)
      ? selectedComps.filter(c => c !== comp)
      : [...selectedComps, comp];
    
    setSelectedComps(updatedComps);

    const autoDesc = updatedComps.length > 0 
      ? "⚡ CONFIGURATION SUR MESURE : \n" + updatedComps.map(c => `• ${c}`).join('\n') 
      : newProduct.description;
    
    setNewProduct(prev => ({ ...prev, description: autoDesc }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingId ? `/products/${editingId}` : '/products';
    const method = editingId ? 'patch' : 'post';
    const contentType = editingId ? 'application/merge-patch+json' : 'application/ld+json';

    axiosInstance[method](url, {
      ...newProduct,
      prix: String(newProduct.prix),
      stock_quantite: parseInt(newProduct.stock_quantite)
    }, {
      headers: { 'Content-Type': contentType }
    })
    .then(() => {
      fetchProducts();
      resetForm();
    })
    .catch(() => alert("Erreur lors de l'enregistrement."));
  };

  const resetForm = () => {
    setNewProduct({ nom: '', prix: '', description: '', stock_quantite: 1 });
    setSelectedComps([]);
    setEditingId(null);
    setIsFormOpen(false);
  };

  const startEdit = (p) => {
    setNewProduct({ nom: p.nom, prix: p.prix, description: p.description, stock_quantite: p.stock_quantite });
    setEditingId(p.id);
    setSelectedComps([]); 
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteProduct = (id) => {
    if (window.confirm("Supprimer ce PC ?")) {
      axiosInstance.delete(`/products/${id}`).then(fetchProducts);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-purple-100 p-4 md:p-8">
      <h2 className="text-4xl font-black text-center mb-10 uppercase tracking-tighter text-white">
        Terminal <span className="text-purple-500 shadow-purple-500/40 shadow-lg">Produits</span>
      </h2>

      <div className="text-center mb-10">
        <button 
          onClick={() => isFormOpen ? resetForm() : setIsFormOpen(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-2xl font-black shadow-[0_0_25px_rgba(147,51,234,0.4)] transition-all"
        >
          {isFormOpen ? '✖ ANNULER' : '➕ CRÉER UNE CONFIGURATION'}
        </button>
      </div>

      {isFormOpen && (
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-700 rounded-2xl p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-2 font-bold">Nom du PC</label>
                <input 
                  type="text" 
                  placeholder="Ex: Gaming Beast Ultra" 
                  value={newProduct.nom} 
                  onChange={(e) => setNewProduct({...newProduct, nom: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-2 font-bold">Prix (€)</label>
                <input 
                  type="number" 
                  placeholder="1299" 
                  value={newProduct.prix} 
                  onChange={(e) => setNewProduct({...newProduct, prix: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-2 font-bold">Quantité en stock</label>
              <input 
                type="number" 
                value={newProduct.stock_quantite} 
                onChange={(e) => setNewProduct({...newProduct, stock_quantite: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-3 font-bold">Description</label>
              <textarea 
                placeholder="Description du PC" 
                value={newProduct.description} 
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                rows="5"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-3 font-bold">Composants</label>
              <div className="grid md:grid-cols-2 gap-3 max-h-96 overflow-y-auto bg-slate-800 p-4 rounded-lg border border-slate-700">
                {Object.entries(COMPONENT_CATEGORIES).map(([category, items]) => (
                  <div key={category}>
                    <label className="block font-bold text-purple-400 mb-2">{category}</label>
                    {items.map((item) => (
                      <div key={item} className="ml-2 mb-1">
                        <label className="flex items-center text-slate-300 cursor-pointer hover:text-purple-400">
                          <input 
                            type="checkbox" 
                            checked={selectedComps.includes(item)}
                            onChange={() => handleCheck(item)}
                            className="mr-2 w-4 h-4 accent-purple-500"
                          />
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white px-6 py-4 rounded-lg font-black transition-all"
            >
              {editingId ? '💾 MODIFIER' : '➕ CRÉER'}
            </button>
          </form>
        </div>
      )}

      {/* Grille des produits */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500 transition-all group">
            <h3 className="text-lg font-black text-white group-hover:text-purple-400 transition-colors mb-2">
              {p.nom}
            </h3>
            <p className="text-2xl font-black text-purple-500 mb-3">{p.prix}€</p>
            <p className="text-slate-400 text-sm mb-4 line-clamp-3">{p.description}</p>
            <p className="text-slate-500 text-sm mb-4">📦 Stock: {p.stock_quantite}</p>
            
            <div className="flex gap-2">
              <button 
                onClick={() => startEdit(p)}
                className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-bold py-2 px-3 rounded-lg transition-all text-sm border border-blue-500/40"
              >
                ✏️ Modifier
              </button>
              <button 
                onClick={() => deleteProduct(p.id)}
                className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 font-bold py-2 px-3 rounded-lg transition-all text-sm border border-red-500/40"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
