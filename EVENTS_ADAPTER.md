# 🔄 Mise à Jour des Composants - Adaptés à la BD Réelle

## 📝 Sommaire

Tu as 2 nouvelles versions des composants, adaptées à ta vraie structure de BD :

1. **Event_NEW.jsx** - Page des événements pour les utilisateurs (rejoindre/quitter)
2. **AdminEvents_NEW.jsx** - Panel de gestion des événements pour les admins

## 🔍 Principales Différences

### Ancienne Version (Supposée)

❌ Créneaux horaires (slots)
❌ Prix
❌ Lieu
❌ Formateur
❌ Réservations détaillées

### Nouvelle Version (Réelle)

✅ Événement simple (titre, description, 2 dates)
✅ Participants via `event_user`
✅ Rejoindre/Quitter l'événement
✅ Dates limites claires

---

## 🚀 Comment Utiliser

### Option 1: Remplacer les Anciennes Versions

```bash
# 1. Sauvegarder les anciennes versions (optionnel)
cp src/pages/Event.jsx src/pages/Event_OLD.jsx
cp src/pages/AdminEvents.jsx src/pages/AdminEvents_OLD.jsx

# 2. Remplacer par les nouvelles
cp src/pages/Event_NEW.jsx src/pages/Event.jsx
cp src/pages/AdminEvents_NEW.jsx src/pages/AdminEvents.jsx

# 3. Supprimer les fichiers _NEW
rm src/pages/Event_NEW.jsx src/pages/AdminEvents_NEW.jsx

# 4. Relancer le frontend
npm run dev
```

### Option 2: Tester les Nouvelles Versions

**Garder les anciennes et tester les nouvelles :**

```bash
# Créer des routes temporaires pour tester:

# Dans src/App.jsx, ajouter:
import EventNew from './pages/Event_NEW';
import AdminEventsNew from './pages/AdminEvents_NEW';

// Et ajouter les routes:
<Route path="/events-new" element={<EventNew />} />
<Route path="/admin/events-new" element={<AdminEventsNew />} />

# Puis tester:
# http://localhost:5173/events-new
# http://localhost:5173/admin/events-new
```

---

## ✅ Fonctionnalités Implémentées

### Event_NEW.jsx (Page Utilisateur)

| Fonctionnalité                         | Status |
| -------------------------------------- | ------ |
| Afficher la liste des événements       | ✅     |
| Afficher titre, description, dates     | ✅     |
| Afficher nombre de participants        | ✅     |
| Bouton "✅ Rejoindre"                  | ✅     |
| Bouton "❌ Quitter" (si déjà inscrit)  | ✅     |
| Bouton "⏰ Fermé" (si deadline passée) | ✅     |
| Modal avec détails de l'événement      | ✅     |
| Messages de succès/erreur              | ✅     |

### AdminEvents_NEW.jsx (Panel Admin)

| Fonctionnalité            | Status |
| ------------------------- | ------ |
| Créer un événement        | ✅     |
| Modifier un événement     | ✅     |
| Supprimer un événement    | ✅     |
| Validation des champs     | ✅     |
| Afficher liste événements | ✅     |
| Afficher participants     | ✅     |
| Messages feedback         | ✅     |

---

## 📡 Endpoints Utilisés

### Event_NEW.jsx

```
GET /api/events
GET /api/user/events
POST /api/events/{id}/join
DELETE /api/events/{id}/leave
```

### AdminEvents_NEW.jsx

```
GET /api/events
POST /api/events
PUT /api/events/{id}
DELETE /api/events/{id}
```

---

## ⚠️ Points Importants

1. **Les endpoints `/join` et `/leave` doivent exister** côté backend
   - Si pas présents, adapter le code pour utiliser une autre approche

2. **La structure des données retournées par l'API doit correspondre**

   ```json
   {
     "id": 1,
     "title": "...",
     "description": "...",
     "deadlineJoin": "2026-05-15T23:59:59Z",
     "deadline": "2026-05-20T18:00:00Z",
     "participants": 12
   }
   ```

3. **Authentication Bearer token doit être envoyé**
   - Configuré dans `src/services/axiosConfig.js`

---

## 🧪 Test Complet

### 1. User - Voir et Rejoindre

```
1. Se connecter en tant qu'user
2. Aller dans /events ou /events-new
3. Voir la liste des événements
4. Cliquer "✅ Rejoindre"
5. Voir "❌ Quitter" à la place
6. Message: "✅ Vous avez rejoint l'événement!"
```

### 2. User - Quitter

```
1. Sur un événement rejoint, cliquer "❌ Quitter"
2. Voir "✅ Rejoindre" à la place
3. Message: "✅ Vous avez quitté l'événement!"
```

### 3. Admin - Créer

```
1. Aller dans /admin/events ou /admin/events-new
2. Cliquer "➕ Créer Événement"
3. Remplir: Titre, Description, 2 dates
4. Cliquer "➕ Créer"
5. Voir l'événement dans la liste
6. Message: "✅ Événement créé avec succès!"
```

### 4. Admin - Modifier

```
1. Cliquer "✏️ Modifier" sur un événement
2. Formulaire se remplit
3. Modifier un champ
4. Cliquer "💾 Modifier"
5. Voir les changements dans la liste
6. Message: "✅ Événement modifié avec succès!"
```

### 5. Admin - Supprimer

```
1. Cliquer "🗑️ Supprimer"
2. Confirmer
3. Événement disparaît
4. Message: "✅ Événement supprimé"
```

---

## 🔧 Si Les Endpoints N'Existent Pas

**Si le backend ne retourne pas `/api/events/{id}/join` ou `/api/events/{id}/leave` :**

1. Adapter Event_NEW.jsx pour utiliser un endpoint alternatif
2. Ou créer les endpoints côté backend

Exemple d'adaptation possible:

```javascript
// Si endpoint POST /api/events/{id}/join n'existe pas
// mais que event_user doit être créé manuellement:

const handleJoinEvent = async (eventId) => {
  try {
    await axiosInstance.post("/event-user", {
      eventId: eventId,
      userId: getCurrentUserId(),
    });
    // ...
  } catch (error) {
    // ...
  }
};
```

---

## 📊 Comparaison Avant/Après

| Aspect              | Avant                  | Après                       |
| ------------------- | ---------------------- | --------------------------- |
| Structure BD        | Complexe (slots)       | Simple (event_user)         |
| Participation       | Réservation avec slots | Rejoindre/Quitter simple    |
| Prix/Lieu/Formateur | Présents               | Supprimés                   |
| État bouton         | 4 états (slot)         | 3 états (join/leave/closed) |
| Modal               | Détails + slots        | Détails simple              |
| CRUD                | Complexe               | Simple                      |

---

## ✨ Prochaines Étapes

1. **Remplacer les fichiers** (Option 1 ci-dessus)
2. **Tester les endpoints** du backend
3. **Adapter si nécessaire** selon votre API réelle
4. **Intégrer dans App.jsx**
5. **Tester end-to-end**

---

**Besoin d'aide pour intégrer ?** Dis-moi !
