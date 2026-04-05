import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Appel à ton API Symfony
    axios.get('http://127.0.0.1:8000/api/products')
      .then(response => {
        // On récupère le tableau dans 'hydra:member'
        setProducts(response.data['hydra:member'] || response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur API :", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>⏳ Récupération du stock en cours...</h2>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', borderBottom: '2px solid #282c34', paddingBottom: '10px' }}>
        💻 Nos Configurations PC
      </h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
        {products.map(product => (
          <div key={product.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Utilisation de product.nom et product.description */}
              <h3 style={{ margin: '0 0 10px 0', color: '#282c34' }}>{product.nom}</h3>
              <p style={{ color: '#555', fontSize: '14px', minHeight: '40px' }}>{product.description}</p>
              
              {/* Affichage du stock avec une condition visuelle */}
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: product.stock_quantite > 0 ? '#27ae60' : '#e74c3c' }}>
                {product.stock_quantite > 0 ? `📦 En stock : ${product.stock_quantite}` : '❌ Rupture de stock'}
              </p>
            </div>
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Utilisation de product.prix */}
              <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#e74c3c' }}>{product.prix} €</span>
              
              <button 
                disabled={product.stock_quantite === 0}
                style={{ 
                  padding: '10px 15px', 
                  backgroundColor: product.stock_quantite > 0 ? '#3498db' : '#bdc3c7', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: product.stock_quantite > 0 ? 'pointer' : 'not-allowed', 
                  fontWeight: 'bold' 
                }}
              >
                🛒 Ajouter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;