import { useState } from 'react';
import axiosInstance from '../services/axiosConfig';

const Cart = ({ cart, setCart }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  // 🧮 On calcule le prix total de tous les PC du panier
  const totalPrix = cart.reduce((somme, product) => somme + parseFloat(product.prix), 0);

  // 🗑️ Fonction pour retirer un PC spécifique du panier
  const removeFromCart = (indexToRemove) => {
    // On garde tous les produits SAUF celui sur lequel on a cliqué
    const nouveauPanier = cart.filter((_, index) => index !== indexToRemove);
    setCart(nouveauPanier);
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      setError('');

      // On prépare les données à envoyer au backend (format exact demandé par le backend Symfony)
      const products = cart.map(product => ({
        name: product.nom,
        price: parseFloat(product.prix),
        quantity: 1 // À adapter si tu gères les quantités
      }));

      // Appel vers ton endpoint backend qui va générer la session Stripe Checkout
      const response = await axiosInstance.post('/create-checkout-session', {
        cart: products
      });

      // Le backend doit renvoyer l'URL de la session Stripe
      if (response.data.url) {
        // Redirection vers la page de paiement Stripe (Hosted Checkout)
        window.location.href = response.data.url;
      } else {
        setError("Erreur : l'URL de paiement n'a pas été générée par le serveur.");
      }
    } catch (err) {
      console.error('Erreur Stripe Checkout :', err);
      // On récupère le message d'erreur précis du backend s'il existe
      const backendMessage = err.response?.data?.error || err.response?.data?.message || err.message;
      setError(`Le serveur a refusé la requête (400) : ${backendMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Titre */}
      <h2 className="text-4xl font-black text-center mb-12 uppercase tracking-tighter text-white">
        🛒 <span className="text-purple-500">Mon Panier</span>
      </h2>

      {cart.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 p-16 rounded-2xl text-center">
          <p className="text-slate-400 text-lg italic">
            Ton panier est désespérément vide... Va vite ajouter un PC Gamer ! 🕹️
          </p>
        </div>
      ) : (
        <>
          {/* Liste des produits */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-8 shadow-2xl">
            <div className="divide-y divide-slate-800">
              {cart.map((product, index) => (
                <div key={index} className="p-6 hover:bg-slate-800/50 transition-colors flex justify-between items-center group">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                      {product.nom}
                    </h4>
                    <span className="text-purple-400 font-black text-xl italic">
                      {product.prix} €
                    </span>
                  </div>
                  <button 
                    onClick={() => removeFromCart(index)}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold transition-all ml-4 active:scale-90 whitespace-nowrap"
                  >
                    ❌ Retirer
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 💰 RÉCAPITULATIF */}
          <div className="bg-linear-to-r from-purple-600/20 to-indigo-600/20 border border-purple-500/30 rounded-2xl p-8 mb-8 shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-white uppercase tracking-widest">
                Total à payer
              </h3>
              <h2 className="text-4xl font-black text-purple-400 italic">
                {totalPrix.toFixed(2)} €
              </h2>
            </div>
          </div>

          {/* Affichage des erreurs de paiement */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-4 rounded-lg mb-6 text-center italic">
              {error}
            </div>
          )}
          
          {/* Bouton paiement */}
          <div className="text-center">
            <button 
              onClick={handleCheckout} 
              disabled={isProcessing}
              className={`bg-purple-600 ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500'} text-white px-12 py-4 rounded-lg font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-[0_0_25px_rgba(147,51,234,0.4)] active:scale-95`}
            >
              {isProcessing ? '🔄 Traitement...' : '💳 Payer avec Stripe'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;