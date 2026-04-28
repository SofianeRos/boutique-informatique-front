import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await axiosInstance.post('/login_check', {
        username: email,
        password: password
      });

      // Vérifier que le token est bien présent
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Notifier le parent (App.jsx) que la connexion a réussi
        if (onLoginSuccess) {
          onLoginSuccess(response.data.token);
        }

        setMessageType('success');
        setMessage('✅ Connexion réussie ! Redirection en cours...');
        
        setTimeout(() => {
          navigate('/admin');
        }, 1000);
      } else {
        throw new Error('Aucun token reçu');
      }

    } catch (error) {
      console.error('Erreur de connexion:', error);
      setMessageType('error');
      
      // Meilleur message d'erreur
      if (error.response?.status === 401) {
        setMessage('❌ Email ou mot de passe incorrect.');
      } else if (error.response?.data?.message) {
        setMessage(`❌ ${error.response.data.message}`);
      } else {
        setMessage('❌ Erreur de connexion. Vérifiez que l\'API est accessible.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-md px-4">
        
        {/* Carte de login avec glassmorphism */}
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl shadow-2xl relative overflow-hidden group">
          
          {/* Effet de halo au survol */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>

          <div className="relative">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
                🔑 <span className="text-purple-500">Connexion</span>
              </h1>
              <p className="text-slate-400 text-sm">Accédez à votre espace administrateur</p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Email */}
              <div>
                <label className="block text-slate-300 font-bold text-sm mb-2 uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="admin@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 p-4 rounded-lg text-white focus:outline-none transition-all placeholder-slate-600 font-medium"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-slate-300 font-bold text-sm mb-2 uppercase tracking-widest">
                  Mot de passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 p-4 rounded-lg text-white focus:outline-none transition-all placeholder-slate-600 font-medium"
                />
              </div>

              {/* Bouton soumettre */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-3 px-6 rounded-lg uppercase tracking-widest transition-all shadow-lg hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] active:scale-95 mt-8"
              >
                {loading ? '⏳ Connexion...' : '🚀 Se connecter'}
              </button>
            </form>

            {/* Message de feedback */}
            {message && (
              <div className={`mt-6 p-4 rounded-lg text-center font-bold text-sm transition-all ${
                messageType === 'success' 
                  ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300' 
                  : 'bg-red-500/20 border border-red-500/50 text-red-300'
              }`}>
                {message}
              </div>
            )}

            {/* Lien vers register */}
            <div className="mt-8 text-center border-t border-slate-800 pt-6">
              <p className="text-slate-400 text-sm">
                Pas encore de compte ?{' '}
                <Link 
                  to="/register" 
                  className="text-purple-400 font-bold hover:text-purple-300 transition-colors"
                >
                  S'inscrire ici
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;