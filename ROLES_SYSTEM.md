# ✅ SYSTÈME DE RÔLES - Implémenté côté Frontend

## 🎯 Ce Qui a Changé

### Frontend (Déjà Fait)

**App.jsx:**

- ✅ Ajout état `userRoles`
- ✅ Stockage des roles dans localStorage
- ✅ Lien "Admin" affiché **seulement si** user a `ROLE_ADMIN`
- ✅ Logout supprime les roles

**Login.jsx & Register.jsx:**

- ✅ Extraient les roles de la réponse backend
- ✅ Passent les roles au callback `handleLoginSuccess(token, roles)`
- ✅ Redirection intelligente:
  - Admin → `/admin`
  - User simple → `/profile`

---

## 🔐 Comportement Attendu

```
┌─────────────────────────────────────────────────────┐
│ UTILISATEUR SIMPLE (ROLE_USER)                      │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Navbar:                                            │
│  • Accueil                                         │
│  • Mon Profil                          ← Visible   │
│  • [Admin n'apparaît PAS]       ✅ Caché          │
│  • 🛒 Panier                                       │
│                                                     │
│ Routes:                                            │
│  • /            → Accessible           ✅         │
│  • /login       → Accessible           ✅         │
│  • /register    → Accessible           ✅         │
│  • /profile     → Accessible           ✅         │
│  • /cart        → Accessible           ✅         │
│  • /admin       → 🚫 Redirection /login ✅         │
│                                                     │
│ Redirect après login:                              │
│  • POST /api/login_check → /profile    ✅ Nouveau!│
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│ ADMINISTRATEUR (ROLE_ADMIN)                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Navbar:                                            │
│  • Accueil                                         │
│  • Mon Profil                                      │
│  • ⚙️ Admin                       ← Visible ✅     │
│  • 🛒 Panier                                       │
│                                                     │
│ Routes:                                            │
│  • /admin       → Accessible           ✅         │
│  • Autres routes identiques                       │
│                                                     │
│ Redirect après login:                              │
│  • POST /api/login_check → /admin      ✅ OK      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration Backend Requise

**⚠️ IMPORTANT:** Pour que ça marche correctement, votre backend DOIT retourner les roles!

### Ce que le frontend attend:

```json
// POST /api/auth/register
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "username": "demo",
    "email": "demo@test.com",
    "firstName": "Demo",
    "lastName": "User",
    "roles": ["ROLE_USER"]     ← 🔑 IMPORTANT!
  }
}

// POST /api/login_check
{
  "token": "eyJhbGc..."
  // Peut retourner ou pas l'user (généralement juste le token)
}

// GET /api/user/profile (optionnel mais recommandé)
{
  "id": 1,
  "username": "demo",
  "email": "demo@test.com",
  "firstName": "Demo",
  "lastName": "User",
  "roles": ["ROLE_USER"]      ← 🔑 Recommandé pour sync
}
```

### Comment Mettre à Jour le Backend (Symfony)

Si votre backend ne retourne pas les roles, ajoutez-les:

```php
// src/Controller/UserController.php

#[Route('/api/auth/register', name: 'user_register', methods: ['POST'])]
public function registerUser(Request $request): JsonResponse
{
    // ... code existant ...

    // Retourner les roles
    return new JsonResponse([
        'token' => $token,
        'user' => [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'roles' => $user->getRoles(),  // ← AJOUTER CETTE LIGNE
        ]
    ], JsonResponse::HTTP_CREATED);
}

#[Route('/api/user/profile', name: 'user_profile', methods: ['GET'])]
public function getProfile(): JsonResponse
{
    $user = $this->getUser();

    return new JsonResponse([
        'id' => $user->getId(),
        'username' => $user->getUsername(),
        'email' => $user->getEmail(),
        'firstName' => $user->getFirstName(),
        'lastName' => $user->getLastName(),
        'createdAt' => $user->getCreatedAt()?->format('Y-m-d\TH:i:s\Z'),
        'roles' => $user->getRoles(),  // ← AJOUTER CETTE LIGNE
    ]);
}
```

---

## 🧪 Tests

### Test 1: Créer un User Simple

```
1. Inscription normale via /register
2. Expected:
   • Redirect vers /profile (pas /admin)
   • Navbar n'affiche pas "Admin"
   • localStorage.getItem('userRoles') = ["ROLE_USER"]
```

### Test 2: Créer un Admin Manuellement

```
1. Backend DB:
   UPDATE \`user\` SET roles = '["ROLE_USER","ROLE_ADMIN"]' WHERE id = X

2. Login avec ce compte
3. Expected:
   • Redirect vers /admin
   • Navbar affiche "⚙️ Admin"
   • localStorage.getItem('userRoles') = ["ROLE_USER","ROLE_ADMIN"]
```

### Test 3: User Simple Essaie /admin

```
1. Login en tant que user simple
2. Essayer d'accéder à http://localhost:5175/admin
3. Expected:
   • Redirection /login
   • Message erreur ou juste redirection silencieuse
```

---

## 📊 Checklist

```
Frontend:
[✅] App.jsx stocke userRoles
[✅] Login.jsx extrait et passe roles
[✅] Register.jsx extrait et passe roles
[✅] Redirect intelligente (Admin → /admin, User → /profile)
[✅] Navbar affiche "Admin" seulement si ROLE_ADMIN
[✅] localStorage persiste les roles

Backend:
[🔄] POST /api/auth/register retourne roles ← À VÉRIFIER
[🔄] GET /api/user/profile retourne roles   ← À VÉRIFIER
[🔄] New users ont roles = ["ROLE_USER"]    ← Déjà OK

Tests:
[🔄] User simple sans accès Admin         ← À TESTER
[🔄] Admin avec accès Admin               ← À TESTER
[🔄] Redirection correcte après login     ← À TESTER
```

---

## 💡 Fallback (Si Backend ne retourne pas roles)

Le frontend a un fallback automatique:

- Si `response.data.user.roles` n'existe pas → `['ROLE_USER']`
- Donc même si backend ne retourne pas les roles, ça marche pour les users simples
- **MAIS:** Les admins ne seront pas reconnus comme admins!

**Solution:** Mettez à jour le backend pour retourner les roles (voir section ci-dessus)

---

## 🎯 Résumé

| Composant     | Status        | Action                          |
| ------------- | ------------- | ------------------------------- |
| Frontend      | ✅ Fait       | Rien - testé                    |
| Backend roles | 🔄 À vérifier | Ajouter roles à la réponse JSON |
| Tests         | 🔄 À faire    | Tester les 3 cas ci-dessus      |

---

**Une fois que le backend retourne les roles → L'accès à Admin sera automatiquement restreint aux admins!** 🎉
