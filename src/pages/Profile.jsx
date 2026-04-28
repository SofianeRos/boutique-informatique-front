import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Essayer de récupérer les infos utilisateur depuis le JWT
        // ou depuis une route /api/me
        const response = await axiosInstance.get('/user/profile');
        setUser(response.data);
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

    fetchProfile();
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
    </div>
  );
};

export default Profile;
