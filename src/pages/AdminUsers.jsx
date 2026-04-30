import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users');
      
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
      
      console.log("🔍 Données utilisateurs reçues par l'API :", data);
      
      setUsers(data);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('❌ Erreur lors du chargement des utilisateurs');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/users/${userId}`);
      setMessage('✅ Utilisateur supprimé');
      setMessageType('success');
      
      setUsers(users.filter(user => user.id !== userId));
      
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('❌ Erreur lors de la suppression de l\'utilisateur');
      setMessageType('error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* En-tête */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">
            <span className="text-blue-500">Gestion Utilisateurs</span>
          </h2>
          <p className="text-slate-400">Gérez les comptes utilisateurs et leurs permissions</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            messageType === 'success'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-red-500/20 text-red-300 border border-red-500/40'
          }`}>
            {message}
          </div>
        )}

        {/* Liste des utilisateurs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-300">
              <thead className="bg-slate-800/50 border-b border-slate-800 text-slate-400 uppercase text-xs font-black tracking-widest">
                <tr>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Rôle</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 font-medium text-white">
                        {user.email || user.username}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.roles?.includes('ROLE_ADMIN') 
                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                            : 'bg-slate-700/50 text-slate-300 border border-slate-600/50'
                        }`}>
                          {user.roles?.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-600/10 hover:bg-red-600/30 text-red-400 border border-red-500/20 hover:border-red-500/40 px-3 py-2 rounded-lg font-bold text-xs transition-all"
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
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

export default AdminUsers;