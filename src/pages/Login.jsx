import { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche la page de se recharger
    
    try {
      // On envoie la requête à ton API Symfony
      const response = await axios.post('http://127.0.0.1:8000/api/login_check', {
        username: email,
        password: password
      });

      // Si le back-end accepte, on range le Token dans le stockage local du navigateur
      localStorage.setItem('token', response.data.token);
      setMessage('✅ Connexion réussie ! Bienvenue Boss.');

    } catch (error) {
      console.error(error);
      setMessage('❌ Erreur : Identifiants incorrects ou API injoignable.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>🔑 Accès Administrateur</h2>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="email"
          placeholder="Email (ex: admin@test.com)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px', fontSize: '16px', backgroundColor: '#282c34', color: 'white', border: 'none', cursor: 'pointer' }}>
          Se connecter
        </button>
      </form>

      {message && (
        <div style={{ marginTop: '20px', padding: '15px', textAlign: 'center', backgroundColor: '#f4f4f4', borderRadius: '5px' }}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Login;