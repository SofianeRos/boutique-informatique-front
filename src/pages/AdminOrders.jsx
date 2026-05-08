import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../services/axiosConfig';

// Composant pour charger dynamiquement les données d'un utilisateur si elles ne sont pas fournies par l'API
const UserInfo = ({ userData }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Si c'est un IRI (ex: '/api/users/10'), on le fetch
    if (typeof userData === 'string' && userData.startsWith('/api/')) {
      // Retirer le '/api' du début car axiosInstance ajoute déjà '/api' dans sa baseURL
      const endpoint = userData.replace('/api/', '/');
      axiosInstance.get(endpoint)
        .then(res => setUser(res.data))
        .catch(() => setUser({ email: 'Erreur chargement' }));
    } else if (typeof userData === 'object' && userData !== null) {
      setUser(userData);
    }
  }, [userData]);

  if (!user && typeof userData === 'string') {
    return <span className="animate-pulse opacity-50">Chargement... ({userData})</span>;
  }
  if (!user) {
    return <span>Utilisateur inconnu</span>;
  }

  return <span>{user.email || user.username || 'Utilisateur inconnu'}</span>;
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/orders');
      
      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data.member) {
        data = response.data.member;
      } else if (response.data['hydra:member']) {
        data = response.data['hydra:member'];
      } else if (response.data.data) {
        data = response.data.data;
      }
      
      console.log("📦 Données de commandes reçues depuis l'API:", data);
      if (data.length > 0) {
        console.log("🧐 Exemple d'une commande (pour vérifier les champs) :", data[0]);
      }
      
      setOrders(data);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('❌ Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Affichage d'un toast de chargement
      const toastId = toast.loading(`Mise à jour de la commande #${orderId}...`, {
        style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
      });

      // Appel PATCH ou PUT à l'API pour changer le statut
      // (Adaptez la méthode HTTP PATCH ou PUT selon ce qu'attend votre API Symfony)
      await axiosInstance.patch(`/orders/${orderId}`, {
        status: newStatus
      }, {
        headers: {
          'Content-Type': 'application/merge-patch+json' // Format standard d'API Platform (Symfony)
        }
      }).catch(async (err) => {
          // Si merge-patch+json échoue, on tente une requête PUT ou PATCH simple
          if (err.response && err.response.status === 415) {
              return await axiosInstance.put(`/orders/${orderId}`, { status: newStatus });
          }
          throw err;
      });

      // Mettre à jour l'état local pour refléter le changement sans recharger toute la page
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));

      toast.success(`Statut mis à jour : ${newStatus}`, {
        id: toastId,
        style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast.error('Erreur lors de la mise à jour. Vérifiez l\'API.', {
        style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
            <span className="text-emerald-500">Gestion Commandes</span>
          </h2>
          <p className="text-slate-400">Historique de tous les achats par utilisateur</p>
        </div>

        {message && (
          <div className="p-4 rounded-lg mb-6 bg-red-500/20 text-red-300 border border-red-500/40">
            {message}
          </div>
        )}

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-300">
              <thead className="bg-slate-800/50 border-b border-slate-800 text-slate-400 uppercase text-xs font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4">ID Commande</th>
                  <th className="px-6 py-4">Utilisateur</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      Aucune commande trouvée
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">#{order.id}</td>
                      <td className="px-6 py-4 text-emerald-400">
                        <UserInfo userData={order.user || order.utilisateur} />
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {order.totalPrix || order.totalPrice || order.total || order.montant || order.amount || order.prix || 0} €
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={order.status || 'Payée'}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors outline-none cursor-pointer text-center appearance-none
                            ${(order.status || 'Payée') === 'Payée' ? 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/40' : ''}
                            ${order.status === 'Expédiée' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/40' : ''}
                            ${order.status === 'Livrée' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/40' : ''}
                            ${order.status === 'Annulée' ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/40' : ''}
                            ${!['Payée', 'Expédiée', 'Livrée', 'Annulée'].includes(order.status || 'Payée') ? 'bg-slate-700/50 text-slate-300 border-slate-600' : ''}
                          `}
                        >
                          <option value="En attente" className="bg-slate-800 text-white">En attente</option>
                          <option value="Payée" className="bg-slate-800 text-white">Payée</option>
                          <option value="Expédiée" className="bg-slate-800 text-white">Expédiée</option>
                          <option value="Livrée" className="bg-slate-800 text-white">Livrée</option>
                          <option value="Annulée" className="bg-slate-800 text-white">Annulée</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;