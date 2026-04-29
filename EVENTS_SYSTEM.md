# 🎯 Système de Gestion d'Événements - Adaptée à la BD Réelle

## 📋 Vue d'Ensemble

Ce système permet:

- **Pour les Admins**: Créer, modifier et supprimer des événements
- **Pour les Users**: Consulter les événements et rejoindre ceux qui les intéressent

## 🗄️ Structure de la Base de Données

**Tables:**

- `event` - Événements (id, title, description, deadlineJoin, deadline)
- `event_user` - Relation Many-to-Many (event_id, user_id)

**Relations:**

```
Event (1) ←→ (∞) User (via event_user)
```

---

## 🛣️ Routes Frontend

### Pour les Utilisateurs

| Route     | Composant | Accès       | Description                      |
| --------- | --------- | ----------- | -------------------------------- |
| `/events` | Event.jsx | Authentifié | Voir les événements et rejoindre |

### Pour les Admins

| Route           | Composant       | Accès                    | Description          |
| --------------- | --------------- | ------------------------ | -------------------- |
| `/admin/events` | AdminEvents.jsx | Authentifié + ROLE_ADMIN | Gérer les événements |

---

## 📱 Interface Utilisateur

### Page Événements (User) - `/events`

**Disposition:** 2 colonnes

- **Colonne 1 (2/3):** Liste des événements disponibles
- **Colonne 2 (1/3):** Détails et bouton "Rejoindre"

**Affichage par événement:**

- Titre
- Description
- Date limite pour rejoindre (deadlineJoin)
- Date limite de l'événement (deadline)
- Nombre de participants
- Bouton "✅ Rejoindre" ou "❌ Quitter"

**État du bouton:**

- "✅ Rejoindre" - Si l'utilisateur n'a pas encore rejoint
- "❌ Quitter" - Si l'utilisateur a déjà rejoint
- "⏰ Fermé" - Si deadlineJoin est dépassée

---

### Panel Gestion Événements (Admin) - `/admin/events`

**Sections:**

1. **Bouton d'ajout:** "➕ Créer Événement"
2. **Formulaire de création/modification** (masqué par défaut)
3. **Liste des événements**

**Formulaire:**

```
Champs:
- Titre * (requis)
- Description * (requis)
- Date limite pour rejoindre * (requis)
- Date limite de l'événement * (requis)

Boutons:
- ➕ Créer (si nouveau)
- 💾 Modifier (si édition)
- Annuler
```

**Actions sur les événements:**

- **✏️ Modifier** - Pré-remplit le formulaire
- **🗑️ Supprimer** - Supprime l'événement et les inscriptions (event_user)
- **👥 Voir les participants** - Liste des utilisateurs inscrits

---

## � Flux de Participation

### Utilisateur Rejoint un Événement

1. Utilisateur clique "✅ Rejoindre"
2. **Requête:** POST `/api/events/{eventId}/join`
3. **Backend:** Crée une entrée dans `event_user`
4. **Frontend:** "✅ Rejoindre" devient "❌ Quitter"
5. **Feedback:** "✅ Vous avez rejoint l'événement!"

### Utilisateur Quitte un Événement

1. Utilisateur clique "❌ Quitter"
2. **Requête:** DELETE `/api/events/{eventId}/leave`
3. **Backend:** Supprime l'entrée dans `event_user`
4. **Frontend:** "❌ Quitter" redevient "✅ Rejoindre"
5. **Feedback:** "✅ Vous avez quitté l'événement!"

---

## 📡 Endpoints Backend

### Pour les Utilisateurs

```
GET /api/events
Récupère la liste de tous les événements

GET /api/events/{id}
Récupère les détails d'un événement

POST /api/events/{id}/join
Utilisateur rejoint l'événement

DELETE /api/events/{id}/leave
Utilisateur quitte l'événement

GET /api/user/events
Récupère les événements de l'utilisateur courant
```

### Pour les Admins

```
POST /api/events
Créer un événement

GET /api/events/{id}
Récupère les détails

PUT /api/events/{id}
Modifier un événement

DELETE /api/events/{id}
Supprimer un événement

GET /api/events/{id}/participants
Récupère la liste des participants
```

---

## 💾 Données Retournées

### Événement (Objet)

```json
{
  "id": 1,
  "title": "Atelier Montage PC - Débutant",
  "description": "Découvrez comment monter un PC personnalisé de A à Z",
  "deadlineJoin": "2026-05-15T23:59:59Z",
  "deadline": "2026-05-20T18:00:00Z",
  "participants": 12,
  "isJoined": false
}
```

### Participant (Objet Simple)

```json
{
  "id": 1,
  "pseudo": "jean_doe",
  "email": "jean@example.com"
}
```

---

## 🎨 États des Événements

| État       | Condition          | Affichage               |
| ---------- | ------------------ | ----------------------- |
| 📅 Ouvert  | deadlineJoin > now | "✅ Rejoindre"          |
| ⏰ Fermé   | deadlineJoin ≤ now | "⏰ Fermé" (désactivé)  |
| ✅ Inscrit | user in event_user | "❌ Quitter"            |
| 🎯 Passé   | deadline < now     | Badge "Événement passé" |

---

## 🔒 Permissions

### Utilisateur

- ✅ Voir tous les événements
- ✅ Rejoindre un événement (si pas dépassé la deadline)
- ✅ Quitter un événement qu'il a rejoint
- ❌ Modifier les événements
- ❌ Supprimer les événements

### Admin

- ✅ Créer des événements
- ✅ Modifier des événements
- ✅ Supprimer des événements
- ✅ Voir la liste des participants
- ✅ Tous les droits des utilisateurs

---

## 🚀 Exemple de Scénario Complet

### Admin Crée un Événement

```
1. Clique "➕ Créer Événement"
2. Remplit:
   - Titre: "Atelier Gaming PC"
   - Description: "Construction d'un PC gameur haute performance"
   - Date limite pour rejoindre: 01/06/2026
   - Date limite: 15/06/2026
3. Clique "➕ Créer"
4. ✅ Événement créé et visible par tous les users
```

### User Rejoint l'Événement

```
1. Va dans /events
2. Voit "Atelier Gaming PC"
3. Clique "✅ Rejoindre"
4. ✅ Message de succès
5. Bouton devient "❌ Quitter"
```

### Admin Voir les Participants

```
1. Va dans /admin/events
2. Clique sur l'événement
3. Clique "👥 Voir les participants"
4. Voit la liste: Jean, Marie, Paul, etc.
```

### User Quitte l'Événement

```
1. Va dans /events
2. Sur "Atelier Gaming PC" clique "❌ Quitter"
3. ✅ Message de succès
4. Bouton redevient "✅ Rejoindre"
```

---

## ✅ Statuts API & Messages

| Code | Signification                          |
| ---- | -------------------------------------- |
| 200  | Succès (GET, PUT, DELETE)              |
| 201  | Créé (POST)                            |
| 400  | Erreur validation (données manquantes) |
| 401  | Non authentifié                        |
| 403  | Non autorisé (pas admin, etc.)         |
| 404  | Événement non trouvé                   |
| 409  | Conflit (déjà rejoint, etc.)           |

---

## 🚀 Améliorations Futures

- Ajouter des catégories d'événements
- Ajouter un nombre de places limité
- Système de notation/commentaires
- Envoi de notifications
- Calendrier des événements
- Export liste participants (CSV)

---

**Status**: ✅ Frontend adaptée | ⏳ Endpoints à implémenter côté backend
