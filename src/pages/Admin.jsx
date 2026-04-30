import { Link } from 'react-router-dom';

const Admin = () => {
  return (
    <div className="min-h-[calc(100vh-100px)] bg-linear-to-b from-slate-950 to-slate-900">
      
      {/* En-tête */}
      <div className="bg-slate-900 border-b border-slate-800 p-8">
        <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
          <span className="text-orange-500">Tableau de Bord Admin</span>
        </h1>
        <p className="text-slate-400">Gérez tous les aspects de la boutique informatique</p>
      </div>

      {/* Contenu principal */}
      <div className="p-8 max-w-7xl mx-auto">
        
        {/* Dashboard - Grille de sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* Section Produits */}
          <Link 
            to="/admin/products"
            className="group bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-white group-hover:text-purple-400 transition-colors">
                  Produits
                </h2>
                <p className="text-slate-400 text-sm mt-1">Gestion complète des PCs</p>
              </div>

            </div>
            <p className="text-slate-400 mb-4">
              Créer, modifier et supprimer les configurations de PC disponibles à la vente. Gérez les stocks et les prix.
            </p>
            <div className="flex gap-2 text-purple-400 text-sm font-bold">
              <span>Créer</span>
              <span>•</span>
              <span>Modifier</span>
              <span>•</span>
              <span>Supprimer</span>
            </div>
          </Link>

          {/* Section Événements */}
          <Link 
            to="/admin/events"
            className="group bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-white group-hover:text-orange-400 transition-colors">
                  Événements
                </h2>
                <p className="text-slate-400 text-sm mt-1">Ateliers et événements</p>
              </div>
            </div>
            <p className="text-slate-400 mb-4">
              Créer et gérer les événements (ateliers, formations). Définir les dates limites et suivre les participants.
            </p>
            <div className="flex gap-2 text-orange-400 text-sm font-bold">
              <span>Créer</span>
              <span>•</span>
              <span>Modifier</span>
              <span>•</span>
              <span>Participants</span>
            </div>
          </Link>

          {/* Section Utilisateurs */}
          <Link 
            to="/admin/users"
            className="group bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                  Utilisateurs
                </h2>
                <p className="text-slate-400 text-sm mt-1">Gestion des comptes</p>
              </div>
            </div>
            <p className="text-slate-400 mb-4">
              Gérez les utilisateurs inscrits. Possibilité de consulter et de supprimer des comptes utilisateurs de la plateforme.
            </p>
            <div className="flex gap-2 text-blue-400 text-sm font-bold">
              <span>Voir</span>
              <span>•</span>
              <span>Supprimer</span>
            </div>
          </Link>

          {/* Section Commandes (Nouveau) */}
          <Link 
            to="/admin/orders"
            className="group bg-slate-900 border border-slate-800 rounded-xl p-8 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  Commandes
                </h2>
                <p className="text-slate-400 text-sm mt-1">Historique des achats</p>
              </div>
            </div>
            <p className="text-slate-400 mb-4">
              Gérez et visualisez toutes les commandes effectuées par les utilisateurs sur la plateforme.
            </p>
            <div className="flex gap-2 text-emerald-400 text-sm font-bold">
              <span>Voir l'historique</span>
            </div>
          </Link>

        </div>

        {/* Section Accès Rapide */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
          <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter">
            Accès Rapides
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              to="/admin/products"
              className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 hover:border-purple-500 text-purple-300 font-bold py-3 px-4 rounded-lg transition-all text-center"
            >
              Nouveau Produit
            </Link>
            <Link 
              to="/admin/events"
              className="bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/40 hover:border-orange-500 text-orange-300 font-bold py-3 px-4 rounded-lg transition-all text-center"
            >
              Nouvel Événement
            </Link>
            <Link 
              to="/admin/products"
              className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 hover:border-blue-500 text-blue-300 font-bold py-3 px-4 rounded-lg transition-all text-center"
            >
              Voir Produits
            </Link>
            <Link 
              to="/admin/events"
              className="bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 hover:border-emerald-500 text-emerald-300 font-bold py-3 px-4 rounded-lg transition-all text-center"
            >
              Voir Événements
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;
