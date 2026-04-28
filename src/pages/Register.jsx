import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosConfig';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setMessageType('error');
      setMessage('❌ Le nom d\'utilisateur est requis.');
      return false;
    }
    if (formData.username.length < 3) {
      setMessageType('error');
      setMessage('❌ Le nom d\'utilisateur doit contenir au moins 3 caractères.');
      return false;
    }
    if (!formData.email.includes('@')) {
      setMessageType('error');
      setMessage('❌ Veuillez entrer une adresse email valide.');
      return false;
    }
    if (formData.password.length < 6) {
      setMessageType('error');
      setMessage('❌ Le mot de passe doit contenir au moins 6 caractères.');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setMessageType('error');
      setMessage('❌ Les mots de passe ne correspondent pas.');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      // Appel à l'endpoint d'enregistrement sécurisé
      const response = await axiosInstance.post('/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || null,
        lastName: formData.lastName || null
      });

      // Si un token est retourné, on le sauvegarde
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Extraire les roles de la réponse (par défaut: ROLE_USER)
        const roles = response.data.user?.roles || ['ROLE_USER'];
        
        // Notifier le parent (App.jsx) que l'inscription a réussi + roles
        if (onRegisterSuccess) {
          onRegisterSuccess(response.data.token, roles);
        }

        setMessageType('success');
        setMessage('✅ Inscription réussie ! Redirection en cours...');
        
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        // Si pas de token, rediriger vers login
        setMessageType('success');
        setMessage('✅ Inscription réussie ! Redirection vers connexion...');
        
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      let errorMsg = 'Une erreur est survenue lors de l\'inscription.';
      
      if (error.response?.status === 409) {
        errorMsg = '❌ Cet utilisateur ou email existe déjà.';
      } else if (error.response?.data?.message) {
        errorMsg = `❌ ${error.response.data.message}`;
      } else if (error.response?.data?.detail) {
        errorMsg = `❌ ${error.response.data.detail}`;
      }
      
      setMessageType('error');
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-2xl px-4">
        
        {/* Carte d'inscription avec glassmorphism */}
        <div className="bg-slate-900 border border-slate-800 p-10 rounded-2xl shadow-2xl relative overflow-hidden group">
          
          {/* Effet de halo au survol */}
          <div className="absolute -inset-1 bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500"></div>

          <div className="relative">
            <div className="text-center mb-10">
              <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
                ⚡ <span className="text-purple-500">S'inscrire</span>
              </h1>
              <p className="text-slate-400 text-sm">Créez un compte pour accéder à la boutique</p>
            </div>

            {/* Formulaire */}
            <form onSubmit={handleRegister} className="space-y-5">
              
              {/* Ligne 1 : Prénom et Nom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold text-sm mb-2 uppercase tracking-widest">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 p-3 rounded-lg text-white focus:outline-none transition-all placeholder-slate-600 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold text-sm mb-2 uppercase tracking-widest">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 p-3 rounded-lg text-white focus:outline-none transition-all placeholder-slate-600 font-medium"
                  />
                </div>
              </div>

              {/* Nom d'utilisateur */}
              <div>
                <label className="block text-slate-300 font-bold text-sm mb-2 uppercase tracking-widest">
                  Nom d'utilisateur
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="jeandupont"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 p-3 rounded-lg text-white focus:outline-none transition-all placeholder-slate-600 font-medium"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-slate-300 font-bold text-sm mb-2 uppercase tracking-widest">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="jean@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 p-3 rounded-lg text-white focus:outline-none transition-all placeholder-slate-600 font-medium"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label className="block text-slate-300 font-bold text-sm mb-2 uppercase tracking-widest">
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 p-3 rounded-lg text-white focus:outline-none transition-all placeholder-slate-600 font-medium"
                />
                <p className="text-slate-500 text-xs mt-1">Min. 6 caractères</p>
              </div>

              {/* Confirmer le mot de passe */}
              <div>
                <label className="block text-slate-300 font-bold text-sm mb-2 uppercase tracking-widest">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 p-3 rounded-lg text-white focus:outline-none transition-all placeholder-slate-600 font-medium"
                />
              </div>

              {/* Message de feedback */}
              {message && (
                <div className={`p-4 rounded-lg text-center font-bold text-sm transition-all ${
                  messageType === 'success' 
                    ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-300' 
                    : 'bg-red-500/20 border border-red-500/50 text-red-300'
                }`}>
                  {message}
                </div>
              )}

              {/* Bouton soumettre */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-black py-3 px-6 rounded-lg uppercase tracking-widest transition-all shadow-lg hover:shadow-[0_0_20px_rgba(147,51,234,0.4)] active:scale-95 mt-8"
              >
                {loading ? '⏳ Inscription en cours...' : '🚀 S\'inscrire'}
              </button>
            </form>

            {/* Lien vers login */}
            <div className="mt-8 text-center border-t border-slate-800 pt-6">
              <p className="text-slate-400 text-sm">
                Déjà un compte ?{' '}
                <Link 
                  to="/login" 
                  className="text-purple-400 font-bold hover:text-purple-300 transition-colors"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
