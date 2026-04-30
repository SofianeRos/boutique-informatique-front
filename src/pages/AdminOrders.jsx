import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';

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
      
      setOrders(data);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('❌ Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
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
                        {order.user?.email || order.user?.username || 'Utilisateur inconnu'}
                      </td>
                      <td className="px-6 py-4 font-medium">{order.totalPrix || order.totalPrice || 0} €</td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">
                          {order.status || 'Payée'}
                        </span>
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