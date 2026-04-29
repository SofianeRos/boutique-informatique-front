# 🎯 Guide Admin - Modification Événements & Accès

## Problème

"J'ai plus accès à ma route admin même en admin et j'aimerais modifier les events"

## ✅ Solutions

### 1️⃣ Modifier un Événement (DÉJÀ FONCTIONNELLE)

La modification est **déjà implémentée** dans `/src/pages/AdminEvents.jsx`

**Comment l'utiliser:**

```
1. Aller à /admin
2. Cliquer "🎯 Gestion Événements"
3. Voir la liste des événements
4. Cliquer "✏️ Modifier" sur un événement
5. Modifier les champs souhaités
6. Cliquer "💾 Modifier"
```

**Fonctionnalités incluses:**

- ✅ Créer un événement (➕ Créer)
- ✅ **Modifier un événement (✏️ Modifier)**
- ✅ **Supprimer un événement (🗑️ Supprimer)**
- ✅ Gérer les créneaux horaires dynamiquement

---

### 2️⃣ Pas Accès à /admin ? Diagnostic

**Vérifier les rôles (30 secondes):**

```javascript
// Ouvrir F12, console et exécuter:
localStorage.getItem("userRoles");

// Résultats:
// ✅ ["ROLE_ADMIN","ROLE_USER"]  → Allez à "Solution 2b"
// ❌ ["ROLE_USER"] ou []          → Allez à "Solution 2a"
```

---

#### Solution 2a: Rôles Manquants

**Backend:**

```bash
# Promouvoir l'utilisateur en admin
php bin/console app:promote-user votre-email@test.com

# Vérifier
php bin/console app:list-users
# Chercher votre email, colonne Rôles doit avoir: ROLE_ADMIN, ROLE_USER
```

**Frontend:**

```
1. Se déconnecter (logout)
2. Se reconnecter
3. Vérifier: localStorage.getItem('userRoles')
4. Doit afficher: ["ROLE_ADMIN","ROLE_USER"]
```

---

#### Solution 2b: Rôles Présents Mais Accès Refusé

```
1. Actualiser la page (Ctrl+F5)
2. Si toujours bloqué:
   - F12 → Console → Voir les logs de ProtectedRoute
   - Se déconnecter complètement
   - Fermer l'onglet et le rouvrir
   - Se reconnecter
```

---

#### Solution 2c: Backend Doit Retourner les Rôles

**Vérifier que `/api/login_check` retourne les rôles:**

```bash
curl -X POST http://127.0.0.1:8000/api/login_check \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"password123"}' | jq

# Réponse DOIT inclure:
# {
#   "token": "...",
#   "user": {
#     "id": 1,
#     "email": "admin@test.com",
#     "roles": ["ROLE_ADMIN", "ROLE_USER"]  ← IMPORTANT
#   }
# }
```

**Si rôles absents, éditer le LoginController:**

```php
// src/Controller/SecurityController.php (ou AuthController.php)

return $this->json([
    'token' => $token,
    'user' => [
        'id' => $user->getId(),
        'email' => $user->getEmail(),
        'roles' => $user->getRoles()  // ← À AJOUTER !
    ]
]);
```

---

## 🔍 Checklist Complète

- [ ] Vérifier `localStorage.getItem('userRoles')` en console
- [ ] Si besoin: `php bin/console app:promote-user votreemail`
- [ ] Se reconnecter au frontend
- [ ] Voir "⚙️ Admin" dans la navbar
- [ ] Cliquer "⚙️ Admin" → Voir la page
- [ ] Cliquer "🎯 Gestion Événements"
- [ ] Voir la liste des événements
- [ ] Cliquer "✏️ Modifier" sur un événement
- [ ] Formulaire se remplit ✓
- [ ] Modifier un champ
- [ ] Cliquer "💾 Modifier"
- [ ] Voir: "✅ Événement modifié avec succès"

---

## 📁 Fichiers Concernés

- `src/App.jsx` - Gestion authentification et rôles
- `src/components/ProtectedRoute.jsx` - Vérification des rôles
- `src/pages/AdminEvents.jsx` - **Modification des événements (CRUD complet)**
- `src/services/axiosConfig.js` - Configuration HTTP

---

## 🆘 Si Ça Ne Marche Pas

**Cas 1: Pas de "⚙️ Admin" dans la navbar**

```bash
# Backend
php bin/console app:promote-user votreemail@test.com

# Frontend
localStorage.clear()
# Se reconnecter
```

**Cas 2: Clic Admin → Redirection /home**

```javascript
// F12 Console
localStorage.getItem("userRoles");
// Doit avoir ROLE_ADMIN

// Sinon: Cas 1 ci-dessus
```

**Cas 3: "Erreur lors du chargement" dans AdminEvents**

```bash
# Backend - Logs
tail -f var/log/dev.log

# Vérifier que:
1. Endpoint GET /api/events existe
2. Token est valide (pas erreur 401)
3. Pas d'erreur 403 (permission)
```

---

## 💡 Résumé

| Question                | Réponse                               |
| ----------------------- | ------------------------------------- |
| Modifier un événement?  | ✏️ Bouton dans AdminEvents            |
| Pas accès à /admin?     | Vérifier rôles → promouvoir si besoin |
| Supprimer un événement? | 🗑️ Bouton dans AdminEvents            |
| Créer un événement?     | ➕ Bouton dans AdminEvents            |

---

**👉 Commencez par vérifier: `localStorage.getItem('userRoles')` en F12 console**
