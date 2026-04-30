import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Essayer de récupérer les infos utilisateur
        const profileRes = await axiosInstance.get('/user/profile');
        setUser(profileRes.data);

        // Essayer de récupérer SES commandes
        // Le backend doit filtrer par l'utilisateur connecté sur la route /orders
        try {
          const ordersRes = await axiosInstance.get('/orders');
          
          let ordersData = [];
          if (Array.isArray(ordersRes.data)) {
            ordersData = ordersRes.data;
          } else if (ordersRes.data.member) {
            ordersData = ordersRes.data.member;
          } else if (ordersRes.data['hydra:member']) {
            ordersData = ordersRes.data['hydra:member'];
          } else if (ordersRes.data.data) {
            ordersData = ordersRes.data.data;
          }
          
          setOrders(ordersData);
        } catch (e) {
          console.warn("Impossible de charger les commandes:", e);
        }

      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err);
        setError('Impossible de charger votre profil');
        
        // Si le token est expiré/invalide, rediriger vers login
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-red-500/20 border border-red-500/50 text-red-300 p-6 rounded-lg text-center font-bold">
          ❌ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-4xl font-black text-center mb-12 uppercase tracking-tighter text-white">
        👤 <span className="text-purple-500">Mon Profil</span>
      </h2>

      {user ? (
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl shadow-2xl relative overflow-hidden group">
          
          {/* Effet de halo au survol */}
          <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>

          <div className="relative space-y-6">
            
            {/* Nom d'utilisateur */}
            <div>
              <label className="block text-slate-400 font-bold text-xs mb-2 uppercase tracking-widest">
                Nom d'utilisateur
              </label>
              <div className="bg-slate-950 border border-slate-700 p-4 rounded-lg text-white font-medium">
                {user.username || 'N/A'}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-slate-400 font-bold text-xs mb-2 uppercase tracking-widest">
                Email
              </label>
              <div className="bg-slate-950 border border-slate-700 p-4 rounded-lg text-white font-medium">
                {user.email || 'N/A'}
              </div>
            </div>

            {/* Prénom */}
            {user.firstName && (
              <div>
                <label className="block text-slate-400 font-bold text-xs mb-2 uppercase tracking-widest">
                  Prénom
                </label>
                <div className="bg-slate-950 border border-slate-700 p-4 rounded-lg text-white font-medium">
                  {user.firstName}
                </div>
              </div>
            )}

            {/* Nom */}
            {user.lastName && (
              <div>
                <label className="block text-slate-400 font-bold text-xs mb-2 uppercase tracking-widest">
                  Nom
                </label>
                <div className="bg-slate-950 border border-slate-700 p-4 rounded-lg text-white font-medium">
                  {user.lastName}
                </div>
              </div>
            )}

            {/* Date d'inscription */}
            {user.createdAt && (
              <div>
                <label className="block text-slate-400 font-bold text-xs mb-2 uppercase tracking-widest">
                  Membre depuis
                </label>
                <div className="bg-slate-950 border border-slate-700 p-4 rounded-lg text-white font-medium">
                  {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                </div>
              </div>
            )}

            {/* Messages d'info */}
            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-lg text-slate-300 text-sm italic">
              ℹ️ Vos informations sont sécurisées.
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-slate-400">
          Aucune donnée utilisateur disponible
        </div>
      )}

      {/* HISTORIQUE DES COMMANDES */}
      <div className="mt-12">
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6">
          📦 <span className="text-indigo-400">Mes Commandes</span>
        </h3>

        {orders.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-500">
            Tu n'as pas encore passé de commande.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex justify-between items-center hover:border-indigo-500/50 transition-colors">
                <div>
                  <div className="text-white font-bold mb-1">
                    Commande #{order.id}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-400">
                    {order.totalPrice || order.totalPrix || 0} €
                  </div>
                  <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                    {order.status || 'Payée'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;
