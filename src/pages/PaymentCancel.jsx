import { Link } from 'react-router-dom';

const PaymentCancel = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="bg-slate-900 border border-slate-800 p-12 rounded-2xl text-center max-w-lg mx-auto shadow-2xl">
        <div className="text-6xl mb-6">❌</div>
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
          Paiement <span className="text-red-500">Annulé</span>
        </h2>
        <p className="text-slate-400 mb-8">
          Ton paiement a été annulé ou a échoué. Ne t'inquiète pas, rien n'a été débité et ton panier t'attend sagement.
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            to="/cart" 
            className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Retour au panier
          </Link>
          <Link 
            to="/home" 
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 px-6 rounded-lg transition-all"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;