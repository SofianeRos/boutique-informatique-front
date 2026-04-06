import { useState, useEffect } from 'react';
import axios from 'axios';

// 📋 NOTRE CATALOGUE DE COMPOSANTS (Tu pourras en ajouter d'autres ici !)
const AVAILABLE_COMPONENTS = [
  "Processeur Intel Core i9", "Processeur AMD Ryzen 7",
  "Carte Graphique NVIDIA RTX 4090", "Carte Graphique NVIDIA RTX 4070",
  "32 Go RAM DDR5", "16 Go RAM DDR4",
  "SSD 2 To NVMe", "SSD 1 To NVMe",
  "Watercooling RGB", "Boîtier Vitré Corsair"
];

const Admin = () => {
  const [products, setProducts] = useState([]);
  
  // ⚙️ GESTION DU PANNEAU DÉROULANT
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedComps, setSelectedComps] = useState([]);

  const [newProduct, setNewProduct] = useState({
    nom: '',
    prix: '',
    description: '',
    stock_quantite: 1
  });

  const token = localStorage.getItem('token');

  // 🔄 Chargement des produits
  const fetchProducts = () => {
    axios.get('http://127.0.0.1:8000/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      let data = res.data['hydra:member'] || res.data.member || res.data;
      if (Array.isArray(data)) setProducts(data);
    })
    .catch(err => console.error("Erreur de chargement", err));
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🧠 LE CERVEAU : Met à jour la description quand on coche une case
  useEffect(() => {
    if (selectedComps.length > 0) {
      // On prend les composants cochés et on les sépare par un tiret
      const autoDescription = "Configuration sur mesure comprenant : \n- " + selectedComps.join('\n- ');
      setNewProduct(prev => ({ ...prev, description: autoDescription }));
    } else {
      setNewProduct(prev => ({ ...prev, description: '' }));
    }
  }, [selectedComps]);

  // ☑️ Fonction quand on coche/décoche un composant
  const handleCheck = (comp) => {
    if (selectedComps.includes(comp)) {
      // Si déjà coché, on le retire
      setSelectedComps(selectedComps.filter(c => c !== comp));
    } else {
      // Sinon, on l'ajoute
      setSelectedComps([...selectedComps, comp]);
    }
  };

  // ➕ Fonction pour AJOUTER un PC à l'API
  const handleAddProduct = (e) => {
    e.preventDefault();

    axios.post('http://127.0.0.1:8000/api/products', {
      nom: newProduct.nom,
      description: newProduct.description,
      prix: String(newProduct.prix),
      stock_quantite: parseInt(newProduct.stock_quantite),
      is_active: true
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/ld+json'
      }
    })
    .then(() => {
      fetchProducts();
      // On remet tout à zéro et on ferme le panneau
      setNewProduct({ nom: '', prix: '', description: '', stock_quantite: 1 });
      setSelectedComps([]);
      setIsFormOpen(false); 
    })
    .catch(err => console.error("Erreur lors de l'ajout", err));
  };

  // 🗑️ Supprimer
  const deleteProduct = (id) => {
    if (window.confirm("🚨 Supprimer définitivement ce PC ?")) {
      axios.delete(`http://127.0.0.1:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => fetchProducts());
    }
  };

  // 📦 Rupture
  const setOutOfStock = (id) => {
    axios.patch(`http://127.0.0.1:8000/api/products/${id}`, 
      { stock_quantite: 0 }, 
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/merge-patch+json' } }
    ).then(() => fetchProducts());
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center', borderBottom: '2px solid #282c34', paddingBottom: '10px' }}>
        🛡️ Tableau de Bord Administrateur
      </h2>

      {/* 🔘 BOUTON POUR OUVRIR LE PANNEAU */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          style={{ padding: '12px 25px', backgroundColor: isFormOpen ? '#7f8c8d' : '#2980b9', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
        >
          {isFormOpen ? '⬆️ Fermer le configurateur' : '➕ Créer un nouveau PC'}
        </button>
      </div>

      {/* 🔽 LE PANNEAU DÉROULANT (S'affiche uniquement si isFormOpen est true) */}
      {isFormOpen && (
        <div style={{ backgroundColor: '#f9f9f9', padding: '25px', borderRadius: '8px', marginTop: '15px', border: '1px solid #ddd', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', animation: 'fadeIn 0.3s' }}>
          
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>⚙️ Configurateur Rapide</h3>
          
          {/* Les Cases à cocher */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '5px', border: '1px solid #eee' }}>
            {AVAILABLE_COMPONENTS.map((comp, index) => (
              <label key={index} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                <input 
                  type="checkbox" 
                  checked={selectedComps.includes(comp)}
                  onChange={() => handleCheck(comp)}
                />
                {comp}
              </label>
            ))}
          </div>

          <form onSubmit={handleAddProduct} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
            <div style={{ flex: '1 1 100%', display: 'flex', gap: '15px' }}>
              <input type="text" placeholder="Nom de la machine (ex: PC Gamer Alpha)" required value={newProduct.nom} onChange={(e) => setNewProduct({ ...newProduct, nom: e.target.value })} style={{ flex: '2', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="number" placeholder="Prix (€)" step="0.01" required value={newProduct.prix} onChange={(e) => setNewProduct({ ...newProduct, prix: e.target.value })} style={{ flex: '1', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="number" placeholder="Stock" required value={newProduct.stock_quantite} onChange={(e) => setNewProduct({ ...newProduct, stock_quantite: e.target.value })} style={{ flex: '1', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            
            {/* La description générée automatiquement (mais on peut quand même la modifier à la main si besoin) */}
            <textarea 
              placeholder="La description se générera automatiquement ici..." 
              required 
              value={newProduct.description} 
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              style={{ flex: '1 1 100%', padding: '15px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '100px', backgroundColor: '#f1f8ff' }}
            />
            
            <button type="submit" style={{ padding: '12px 20px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', width: '100%', fontSize: '16px' }}>
              ✅ Sauvegarder et publier
            </button>
          </form>
        </div>
      )}
      
      {/* LE TABLEAU... */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '30px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <thead>
          <tr style={{ backgroundColor: '#282c34', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '15px' }}>Nom du PC</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>Prix</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>Stock</th>
            <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #ddd', backgroundColor: p.stock_quantite === 0 ? '#ffeaea' : 'white' }}>
              <td style={{ padding: '15px', fontWeight: 'bold' }}>{p.nom}</td>
              <td style={{ padding: '15px', textAlign: 'center', color: '#e74c3c', fontWeight: 'bold' }}>{p.prix} €</td>
              <td style={{ padding: '15px', textAlign: 'center', color: p.stock_quantite > 0 ? '#27ae60' : '#e74c3c', fontWeight: 'bold' }}>
                {p.stock_quantite}
              </td>
              <td style={{ padding: '15px', textAlign: 'center' }}>
                <button 
                  onClick={() => setOutOfStock(p.id)} 
                  disabled={p.stock_quantite === 0}
                  style={{ marginRight: '10px', padding: '8px 12px', backgroundColor: p.stock_quantite === 0 ? '#ccc' : '#f39c12', color: 'white', border: 'none', borderRadius: '4px', cursor: p.stock_quantite === 0 ? 'not-allowed' : 'pointer' }}
                >
                  ⚠️ Rupture
                </button>
                <button 
                  onClick={() => deleteProduct(p.id)} 
                  style={{ padding: '8px 12px', backgroundColor: '#c0392b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  🗑️ Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;