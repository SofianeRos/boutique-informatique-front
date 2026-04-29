import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from '../services/axiosConfig';

const Event = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [userEvents, setUserEvents] = useState([]);
  const [currentUserIri, setCurrentUserIri] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchCurrentUser();
    // Ne pas chercher les événements utilisateur - pas d'endpoint
    // On gérera le join/leave côté client
  }, []);

  const fetchCurrentUser = async () => {
    try {
      // Récupérer le token et le décoder
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('❌ Pas de token trouvé');
        return;
      }

      const decoded = jwtDecode(token);
      console.log('🔓 JWT Decoded:', decoded);

      // Essayer d'extraire l'ID utilisateur du JWT
      // Les JWT Symfony contiennent souvent: sub, user_id, username, email
      let userId = decoded.sub || decoded.user_id || decoded.id;
      
      if (!userId) {
        // Si pas d'ID direct, on peut essayer d'utiliser le username/email
        console.warn('⚠️ Pas d\'ID direct dans le JWT, essai de l\'API...');
        
        // Fallback: essayer les endpoints utilisateur
        try {
          let response;
          try {
            response = await axiosInstance.get('/me');
          } catch {
            response = await axiosInstance.get('/user/profile');
          }
          
          const user = response.data.user || response.data;
          userId = user.id;
          console.log('✅ Utilisateur trouvé via API:', userId);
        } catch (error) {
          console.warn('⚠️ Impossible de récupérer l\'utilisateur courant - join/leave ne marchera pas', error);
          return;
        }
      } else {
        console.log('✅ User ID extrait du JWT:', userId);
      }

      // Construire l'IRI de l'utilisateur
      const userIri = `/api/users/${userId}`;
      console.log('🔍 User IRI:', userIri);
      
      setCurrentUserIri(userIri);
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/events');
      console.log('🔍 RESPONSE RAW:', response.data);
      
      // Chercher les événements à plusieurs endroits possibles
      let data = [];
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data.member) {
        // Format JSON-LD: member array
        data = response.data.member;
      } else if (response.data['hydra:member']) {
        // Format Hydra alternative
        data = response.data['hydra:member'];
      } else if (response.data.data) {
        // Format générique
        data = response.data.data;
      }
      
      console.log('✅ Événements chargés:', data);
      console.log('✅ Nombre d\'événements:', data.length);
      
      if (data.length > 0) {
        console.log('🔍 Premier événement:', JSON.stringify(data[0], null, 2));
      }
      
      setEvents(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      setMessage('❌ Erreur lors du chargement des événements');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const isUserJoined = (eventId) => {
    // Chercher l'événement dans la liste
    const event = events.find(e => e.id === eventId);
    if (!event) return false;
    
    // Vérifier si l'utilisateur est dans la liste users de l'événement
    return event.users && event.users.includes(currentUserIri);
  };

  const isEventOpen = (event) => {
    const now = new Date();
    const deadlineJoin = new Date(event.deadlineJoin);
    return now < deadlineJoin;
  };

  const handleJoinEvent = async (eventId) => {
    try {
      if (!currentUserIri) {
        console.error('❌ User IRI not available');
        setMessage('❌ Erreur: impossible d\'identifier l\'utilisateur');
        setMessageType('error');
        return;
      }

      // Récupérer l'événement courant
      const eventResponse = await axiosInstance.get(`/events/${eventId}`);
      const event = eventResponse.data;
      console.log('🔍 Événement courant:', event);

      // Récupérer la liste des users
      const currentUsers = event.users || [];
      console.log('🔍 Users avant:', currentUsers);

      // Vérifier si l'utilisateur n'est pas déjà dedans
      if (currentUsers.includes(currentUserIri)) {
        setMessage('ℹ️ Vous avez déjà rejoint cet événement!');
        setMessageType('info');
        return;
      }

      // Ajouter l'utilisateur à la liste
      const updatedUsers = [...currentUsers, currentUserIri];
      console.log('🔍 Users après:', updatedUsers);

      // Envoyer la mise à jour PATCH avec le bon Content-Type
      await axiosInstance.patch(
        `/events/${eventId}`,
        { users: updatedUsers },
        { headers: { 'Content-Type': 'application/merge-patch+json' } }
      );

      console.log('✅ Join successful');
      setMessage('✅ Vous avez rejoint l\'événement!');
      setMessageType('success');
      setUserEvents([...userEvents, eventId]);
      
      // Recharger les événements pour mettre à jour le nombre de participants
      setTimeout(() => fetchEvents(), 500);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage(`❌ ${error.response?.data?.message || 'Erreur lors de l\'inscription'}`);
      setMessageType('error');
    }
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      if (!currentUserIri) {
        console.error('❌ User IRI not available');
        setMessage('❌ Erreur: impossible d\'identifier l\'utilisateur');
        setMessageType('error');
        return;
      }

      // Récupérer l'événement courant
      const eventResponse = await axiosInstance.get(`/events/${eventId}`);
      const event = eventResponse.data;
      console.log('🔍 Événement courant:', event);

      // Récupérer la liste des users
      const currentUsers = event.users || [];
      console.log('🔍 Users avant:', currentUsers);

      // Vérifier si l'utilisateur est dans la liste
      if (!currentUsers.includes(currentUserIri)) {
        setMessage('ℹ️ Vous n\'avez pas rejoint cet événement!');
        setMessageType('info');
        return;
      }

      // Retirer l'utilisateur de la liste
      const updatedUsers = currentUsers.filter(u => u !== currentUserIri);
      console.log('🔍 Users après:', updatedUsers);

      // Envoyer la mise à jour PATCH avec le bon Content-Type
      await axiosInstance.patch(
        `/events/${eventId}`,
        { users: updatedUsers },
        { headers: { 'Content-Type': 'application/merge-patch+json' } }
      );

      console.log('✅ Leave successful');
      setMessage('✅ Vous avez quitté l\'événement!');
      setMessageType('success');
      setUserEvents(userEvents.filter(id => id !== eventId));
      
      // Recharger les événements pour mettre à jour le nombre de participants
      setTimeout(() => fetchEvents(), 500);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage(`❌ ${error.response?.data?.message || 'Erreur lors de la désinscription'}`);
      setMessageType('error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Chargement des événements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-100px)] bg-linear-to-b from-slate-950 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* En-tête */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">
            🎯 <span className="text-purple-500">Événements</span>
          </h1>
          <p className="text-slate-400">Rejoignez les événements qui vous intéressent</p>
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

        {/* Liste des événements */}
        {events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">Aucun événement disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              const isJoined = isUserJoined(event.id);
              const isOpen = isEventOpen(event);
              const deadlineJoin = new Date(event.deadlineJoin);
              const deadline = new Date(event.deadline);
              const now = new Date();

              return (
                <div
                  key={event.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-purple-500/50 transition-all group cursor-pointer"
                  onClick={() => setSelectedEvent(event)}
                >
                  {/* En-tête événement */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition">
                      {event.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">
                      {event.participants || 0} participant(s)
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Dates */}
                  <div className="mb-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>📅 Rejoindre avant:</span>
                      <span className="text-purple-400">
                        {deadlineJoin.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span>🎯 Événement:</span>
                      <span className="text-purple-400">
                        {deadline.toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  {/* État */}
                  {now > deadline && (
                    <div className="mb-4 text-sm text-orange-400">⏰ Événement passé</div>
                  )}

                  {/* Bouton d'action */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isJoined) {
                        handleLeaveEvent(event.id);
                      } else if (isOpen) {
                        handleJoinEvent(event.id);
                      }
                    }}
                    disabled={!isOpen && !isJoined}
                    className={`w-full py-2 px-4 rounded-lg font-bold transition-all ${
                      isJoined
                        ? 'bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40'
                        : isOpen
                        ? 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40'
                        : 'bg-slate-700/20 text-slate-500 border border-slate-700/40 cursor-not-allowed'
                    }`}
                  >
                    {isJoined ? '❌ Quitter' : isOpen ? '✅ Rejoindre' : '⏰ Fermé'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Détail événement sélectionné */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedEvent(null)}>
            <div className="bg-slate-900 rounded-xl p-8 max-w-2xl w-full border border-slate-800" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-3xl font-black text-white mb-4">{selectedEvent.title}</h2>
              <p className="text-slate-400 mb-6">{selectedEvent.description}</p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-400">Participants:</span>
                  <span className="text-purple-400">{selectedEvent.participants || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Rejoindre avant:</span>
                  <span className="text-purple-400">
                    {new Date(selectedEvent.deadlineJoin).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date événement:</span>
                  <span className="text-purple-400">
                    {new Date(selectedEvent.deadline).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedEvent(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 px-4 rounded-lg transition"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Event;
