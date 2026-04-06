const Cart = ({ cart, setCart }) => {
  
  // 🧮 On calcule le prix total de tous les PC du panier
  const totalPrix = cart.reduce((somme, product) => somme + parseFloat(product.prix), 0);

  // 🗑️ Fonction pour retirer un PC spécifique du panier
  const removeFromCart = (indexToRemove) => {
    // On garde tous les produits SAUF celui sur lequel on a cliqué
    const nouveauPanier = cart.filter((_, index) => index !== indexToRemove);
    setCart(nouveauPanier);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', borderBottom: '2px solid #282c34', paddingBottom: '10px' }}>
        🛒 Mon Panier
      </h2>

      {cart.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#7f8c8d', marginTop: '40px' }}>
          Ton panier est désespérément vide... Va vite ajouter un PC Gamer ! 🕹️
        </p>
      ) : (
        <>
          <div style={{ marginTop: '30px' }}>
            {cart.map((product, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', borderBottom: '1px solid #ddd', backgroundColor: '#f9f9f9', marginBottom: '10px', borderRadius: '5px' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{product.nom}</h4>
                  <span style={{ fontWeight: 'bold', color: '#e74c3c' }}>{product.prix} €</span>
                </div>
                <button 
                  onClick={() => removeFromCart(index)}
                  style={{ padding: '8px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  ❌ Retirer
                </button>
              </div>
            ))}
          </div>

          {/* 💰 RÉCAPITULATIF ET PAIEMENT */}
          <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#282c34', color: 'white', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Total à payer :</h3>
            <h2 style={{ margin: 0, color: '#f1c40f' }}>{totalPrix.toFixed(2)} €</h2>
          </div>
          
          <div style={{ textAlign: 'right', marginTop: '20px' }}>
            <button style={{ padding: '15px 30px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }}>
              💳 Valider la commande
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;