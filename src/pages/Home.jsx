import { useState, useEffect } from 'react';
import axios from 'axios';

// On n'oublie pas de récupérer la fonction addToCart envoyée par App.jsx !
const Home = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://127.0.0.1:8000/api/products', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        let data = response.data['hydra:member'] || response.data.member || response.data;

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Format inconnu :", data);
          setProducts([]);
        }
        
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
      
      {products.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'red' }}>Aucun produit trouvé dans la base de données.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '30px' }}>
          {products.map(product => (
            <div key={product.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#282c34' }}>{product.nom}</h3>
                <p style={{ color: '#555', fontSize: '14px', minHeight: '40px' }}>{product.description}</p>
                <p style={{ fontSize: '12px', fontWeight: 'bold', color: product.stock_quantite > 0 ? '#27ae60' : '#e74c3c' }}>
                  {product.stock_quantite > 0 ? `📦 En stock : ${product.stock_quantite}` : '❌ Rupture de stock'}
                </p>
              </div>
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#e74c3c' }}>{product.prix} €</span>
                
                {/* Le fameux bouton mis à jour avec le onClick ! */}
                <button 
                  onClick={() => addToCart(product)} 
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
      )}
    </div>
  );
};

export default Home;