import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

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

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedComps, setSelectedComps] = useState([]);
  const [newProduct, setNewProduct] = useState({ nom: '', prix: '', description: '', stock_quantite: 1 });

  const token = localStorage.getItem('token');

  
  const fetchProducts = useCallback(() => {
    axios.get('http://127.0.0.1:8000/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      let data = res.data['hydra:member'] || res.data.member || res.data;
      if (Array.isArray(data)) setProducts(data);
    })
    .catch(err => console.error("Erreur API", err));
  }, [token]);

  useEffect(() => { 
    fetchProducts(); 
  }, [fetchProducts]);

  const handleCheck = (comp) => {
    let updatedComps = selectedComps.includes(comp)
      ? selectedComps.filter(c => c !== comp)
      : [...selectedComps, comp];
    
    setSelectedComps(updatedComps);

    // Système automatique pour Création ET Modification
    const autoDesc = updatedComps.length > 0 
      ? "⚡ CONFIGURATION SUR MESURE : \n" + updatedComps.map(c => `• ${c}`).join('\n') 
      : newProduct.description; // Garde l'ancienne description si on décoche tout
    
    setNewProduct(prev => ({ ...prev, description: autoDesc }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editingId ? `http://127.0.0.1:8000/api/products/${editingId}` : 'http://127.0.0.1:8000/api/products';
    const method = editingId ? 'patch' : 'post';
    const contentType = editingId ? 'application/merge-patch+json' : 'application/ld+json';

    axios[method](url, {
      ...newProduct,
      prix: String(newProduct.prix),
      stock_quantite: parseInt(newProduct.stock_quantite)
    }, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': contentType }
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
      axios.delete(`http://127.0.0.1:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(fetchProducts);
    }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-purple-100 p-4 md:p-8">
      <h2 className="text-4xl font-black text-center mb-10 uppercase tracking-tighter text-white">
        Terminal <span className="text-purple-500 shadow-purple-500/40 shadow-lg">Admin</span>
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
        <div className="bg-slate-900 border border-purple-500/40 p-8 rounded-3xl mb-16 max-w-6xl mx-auto shadow-2xl animate-in slide-in-from-top duration-300">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">
            {editingId ? '📝 Mode Edition' : '⚙️ Configurateur Expert'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Object.entries(COMPONENT_CATEGORIES).map(([category, items]) => (
              <div key={category} className="bg-slate-800/40 p-3 rounded-xl border border-slate-700">
                <h4 className="text-purple-400 text-[10px] font-black uppercase mb-2 tracking-tighter">{category}</h4>
                <div className="space-y-1">
                  {items.map((item, i) => (
                    <label key={i} className="flex items-center gap-2 text-[11px] cursor-pointer hover:text-white transition-colors">
                      <input type="checkbox" checked={selectedComps.includes(item)} onChange={() => handleCheck(item)} className="w-3 h-3 accent-purple-500" />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <input type="text" placeholder="Désignation du PC" className="bg-slate-950 border border-slate-700 p-4 rounded-xl focus:border-purple-500 outline-none text-white font-bold" value={newProduct.nom} onChange={e => setNewProduct({...newProduct, nom: e.target.value})} required />
              <input type="number" step="0.01" placeholder="Prix (€)" className="bg-slate-950 border border-slate-700 p-4 rounded-xl focus:border-purple-500 outline-none text-purple-400 font-black" value={newProduct.prix} onChange={e => setNewProduct({...newProduct, prix: e.target.value})} required />
              <input type="number" placeholder="Quantité stock" className="bg-slate-950 border border-slate-700 p-4 rounded-xl focus:border-purple-500 outline-none text-emerald-400 font-bold" value={newProduct.stock_quantite} onChange={e => setNewProduct({...newProduct, stock_quantite: e.target.value})} required />
            </div>

            <textarea className="w-full bg-slate-950 border border-slate-700 p-5 rounded-xl h-40 focus:border-purple-500 outline-none text-slate-300 font-mono text-sm" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />

            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl transition-all shadow-xl uppercase">
              {editingId ? '💾 Valider les changements' : '🚀 Lancer la production'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-800/80 text-purple-400 text-xs font-black uppercase">
            <tr>
              <th className="p-6">Machine</th>
              <th className="p-6 text-center">Prix Net</th>
              <th className="p-6 text-center">Stock</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-purple-500/5 transition-colors group">
                <td className="p-6">
                  <div className="font-black text-white group-hover:text-purple-300 transition-colors uppercase">{p.nom}</div>
                  <div className="text-[10px] text-slate-600 font-mono">UUID: {p.id}</div>
                </td>
                <td className="p-6 text-center">
                  <span className="text-purple-400 font-black italic">{p.prix}€</span>
                </td>
                <td className="p-6 text-center font-bold text-emerald-400">
                  {p.stock_quantite} <span className="text-[10px] opacity-50">PCS</span>
                </td>
                <td className="p-6 text-right">
                  <button onClick={() => startEdit(p)} className="bg-slate-800 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold mr-2">EDITER</button>
                  <button onClick={() => deleteProduct(p.id)} className="text-rose-600 hover:text-rose-400 text-xs font-bold px-2">SUPPRIMER</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;