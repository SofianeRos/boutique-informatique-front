import { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadlineJoin: '',
    deadline: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/events');
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
      setEvents(data);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('❌ Erreur lors du chargement');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', deadlineJoin: '', deadline: '' });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.deadlineJoin || !formData.deadline) {
      setMessage('❌ Veuillez remplir tous les champs');
      setMessageType('error');
      return;
    }

    try {
      const url = editingId ? `/events/${editingId}` : '/events';
      const method = editingId ? 'PUT' : 'POST';

      await axiosInstance({
        method,
        url,
        data: formData
      });

      setMessage(`✅ Événement ${editingId ? 'modifié' : 'créé'} avec succès!`);
      setMessageType('success');
      resetForm();
      
      setTimeout(() => {
        fetchEvents();
        setMessage('');
      }, 1500);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('❌ ' + (error.response?.data?.message || 'Erreur lors de l\'enregistrement'));
      setMessageType('error');
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      deadlineJoin: event.deadlineJoin?.split('T')[0] || '',
      deadline: event.deadline?.split('T')[0] || ''
    });
    setEditingId(event.id);
    setIsFormOpen(true);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer cet événement?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/events/${eventId}`);
      setMessage('✅ Événement supprimé');
      setMessageType('success');
      
      setTimeout(() => {
        fetchEvents();
        setMessage('');
      }, 1500);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('❌ Erreur lors de la suppression');
      setMessageType('error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement...</p>
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
            🎯 <span className="text-purple-500">Gestion Événements</span>
          </h2>
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

        {/* Bouton créer */}
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="mb-8 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold py-2 px-4 rounded-lg transition-all"
        >
          {isFormOpen ? '✕ Annuler' : '➕ Créer Événement'}
        </button>

        {/* Formulaire */}
        {isFormOpen && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingId ? '✏️ Modifier l\'événement' : '➕ Créer un nouvel événement'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 mb-2">
                  Titre <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Titre de l'événement"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description détaillée"
                  rows="4"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-2">
                    Date limite pour rejoindre <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="deadlineJoin"
                    value={formData.deadlineJoin}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-2">
                    Date de l'événement <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
                >
                  {editingId ? '💾 Modifier' : '➕ Créer'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2 px-4 rounded-lg transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des événements */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Aucun événement créé pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                
                {/* Titre */}
                <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>

                {/* Description */}
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                {/* Dates */}
                <div className="text-sm text-slate-400 mb-4 space-y-1">
                  <div>📅 Rejoindre avant: {new Date(event.deadlineJoin).toLocaleDateString('fr-FR')}</div>
                  <div>🎯 Événement: {new Date(event.deadline).toLocaleDateString('fr-FR')}</div>
                  <div>👥 Participants: {event.participants || 0}</div>
                </div>

                {/* Boutons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 font-bold py-2 px-3 rounded-lg transition-all text-sm"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 font-bold py-2 px-3 rounded-lg transition-all text-sm"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEvents;
