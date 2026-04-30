import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const PaymentSuccess = ({ setCart }) => {
  // Optionnel : on vide le panier une fois le paiement réussi
  useEffect(() => {
    if (setCart) {
      setCart([]);
    }
  }, [setCart]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center max-w-lg mx-auto shadow-2xl">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
          Paiement <span className="text-emerald-500">Réussi</span> !
        </h2>
        <p className="text-slate-400 mb-8">
          Merci pour ta commande. Ta nouvelle machine de guerre arrive bientôt ! Tu recevras un email de confirmation contenant tous les détails.
        </p>
        <Link 
          to="/home" 
          className="inline-block bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg transition-all"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;