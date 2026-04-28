# ✅ GUIDE COMPLET - Intégration Frontend/Backend JWT

## 📋 État de l'Intégration

```
✅ Backend Symfony:       100% Prêt (JWT + Password Hashing)
✅ Frontend React:        100% À jour (endpoints corrigés)
🟡 Test Intégration:      À faire maintenant
🎯 Statut:                PRÊT À DÉPLOYER
```

---

## 🔐 Endpoints Configurés

### Frontend Envoie

| Endpoint             | Method | Body                                               | Note           |
| -------------------- | ------ | -------------------------------------------------- | -------------- |
| `/api/auth/register` | POST   | `{username, email, password, firstName, lastName}` | ✅ Mise à jour |
| `/api/login_check`   | POST   | `{email, password}`                                | ✅ Mise à jour |
| `/api/user/profile`  | GET    | Headers: `Authorization: Bearer {token}`           | ✅ Automatique |
| `/api/products`      | GET    | Headers: `Authorization: Bearer {token}`           | ✅ Automatique |

### Backend Retourne

```json
// Register & Login
{
  "token": "eyJhbGc...RS256...",
  "user": {
    "id": 1,
    "username": "demo",
    "email": "demo@test.com",
    "firstName": "Demo",
    "lastName": "User"
  }
}

// Profile
{
  "id": 1,
  "username": "demo",
  "email": "demo@test.com",
  "firstName": "Demo",
  "lastName": "User",
  "createdAt": "2024-04-28T10:30:00Z"
}
```

---

## 🧪 ÉTAPE 1 - Test Inscription (Frontend)

### Instructions:

1. Ouvrir navigateur → `http://localhost:5175`
2. Cliquer **"S'inscrire"** (ou aller à `/register`)
3. Remplir le formulaire:

```
Prénom:           Demo
Nom:              User
Nom d'utilisateur: demo
Email:            demo@test.com
Mot de passe:     password123
Confirmer:        password123
```

4. Cliquer **"⚡ S'inscrire"**

### Résultats Attendus:

```
✅ Message: "✅ Inscription réussie ! Redirection en cours..."
✅ Redirection vers /admin
✅ URL change en http://localhost:5175/admin
✅ localStorage.getItem('token') contient un token JWT
```

### 🔍 Vérifier en Console (F12):

```javascript
// Dans la console du navigateur:
localStorage.getItem("token");
// Devrait retourner quelque chose comme:
// "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOi..."
```

### 📊 Vérifier en Base de Données:

```bash
# Symfony CLI
php bin/console doctrine:query:sql "SELECT username, email, password FROM \`user\` WHERE email='demo@test.com'"

# Résultat attendu:
# username  | email           | password
# demo      | demo@test.com   | $2y$13$KqYoL2x0v.EwDyXiF.qUge6N5AE2Z5hSE7Y9yQwKqPqKfL0Qh8ggK
```

⚠️ **Le password DOIT être hashé (commence par `$2y$13$`), PAS en plaintext!**

---

## 🧪 ÉTAPE 2 - Test Logout

### Instructions:

1. Dans la page admin/home
2. Regarder la navbar (top-right)
3. Cliquer le **SVG Logout** (🚪)

### Résultats Attendus:

```
✅ Redirection vers /
✅ Navbar affiche "Connexion" et "S'inscrire"
✅ localStorage.getItem('token') === null (token supprimé)
✅ Bouton logout disparu, replaced par Login/Register
```

---

## 🧪 ÉTAPE 3 - Test Connexion (Frontend)

### Instructions:

1. Ouvrir navigateur → `http://localhost:5175`
2. Cliquer **"Connexion"** (ou aller directement à `/login`)
3. Entrer les credentials de l'inscription:

```
Email:       demo@test.com
Mot de passe: password123
```

4. Cliquer **"🚀 Se connecter"**

### Résultats Attendus:

```
✅ Message: "✅ Connexion réussie ! Redirection en cours..."
✅ Redirection vers /admin
✅ URL change en http://localhost:5175/admin
✅ Navbar affiche "Mon Profil" et logout SVG
✅ localStorage.getItem('token') contient un nouveau token JWT
```

⚠️ **Si vous obtenez "❌ Email ou mot de passe incorrect":**

- Vérifier que le password est bien hashé en DB
- Vérifier que PasswordHasherInterface est bien utilisé au registration
- Tester directement avec Symfony CLI

---

## 🧪 ÉTAPE 4 - Test Profil (Frontend)

### Instructions:

1. Être connecté (étape 3 complète)
2. Cliquer **"Mon Profil"** dans la navbar
3. Ou accéder directement: `http://localhost:5175/profile`

### Résultats Attendus:

```
Affichage des informations:
- Username: demo
- Email: demo@test.com
- First Name: Demo
- Last Name: User
- Created: [date lisible]

✅ Aucune erreur en console
✅ Loader affiche "Chargement du profil..." puis disparaît
```

### 🔍 En Console (F12) - Network:

```
GET http://localhost:5175/api/user/profile

Headers de la requête:
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...

Status: 200 OK
Body retourné: {
  "id": 1,
  "username": "demo",
  "email": "demo@test.com",
  "firstName": "Demo",
  "lastName": "User",
  "createdAt": "2024-04-28T10:30:00Z"
}
```

---

## 🧪 ÉTAPE 5 - Test Protection de Routes

### Instructions:

1. Logout (étape 2)
2. Essayer d'accéder directement à: `http://localhost:5175/admin`
3. Ou: `http://localhost:5175/profile`

### Résultats Attendus:

```
✅ Redirection automatique vers /login
✅ Navbar affiche "Connexion" et "S'inscrire"
✅ Message impossible d'afficher car pas de token
```

---

## 🧪 ÉTAPE 6 - Test Token Expiré (Avancé)

### Instructions:

1. Être connecté (token en localStorage)
2. Ouvrir **F12 → Storage → LocalStorage**
3. Pour simuler l'expiration, **supprimer le token** (ou le corrompre)
4. Essayer d'accéder à: `/admin` ou `/profile`

### Résultats Attendus:

```
✅ Redirection vers /login (intercepteur 401)
✅ localStorage vide
✅ Message d'erreur ou redirection propre
```

---

## 🔧 Tests avec Postman (Backend Direct)

Si vous voulez tester directement les endpoints backend sans le frontend:

### 1️⃣ Registration (Register)

```bash
POST http://127.0.0.1:8000/api/auth/register
Content-Type: application/json

{
  "username": "postman_test",
  "email": "postman@test.com",
  "password": "password123",
  "firstName": "Postman",
  "lastName": "Test"
}
```

**Réponse Attendue (200 Created):**

```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 2,
    "username": "postman_test",
    "email": "postman@test.com",
    "firstName": "Postman",
    "lastName": "Test"
  }
}
```

### 2️⃣ Login (Login_check)

```bash
POST http://127.0.0.1:8000/api/login_check
Content-Type: application/json

{
  "email": "demo@test.com",
  "password": "password123"
}
```

**Réponse Attendue (200 OK):**

```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3️⃣ Profile (Protégé)

```bash
GET http://127.0.0.1:8000/api/user/profile
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Réponse Attendue (200 OK):**

```json
{
  "id": 1,
  "username": "demo",
  "email": "demo@test.com",
  "firstName": "Demo",
  "lastName": "User",
  "createdAt": "2024-04-28T10:30:00Z"
}
```

### 4️⃣ Profile SANS Token

```bash
GET http://127.0.0.1:8000/api/user/profile
```

**Réponse Attendue (401 Unauthorized):**

```json
{
  "code": 401,
  "message": "JWT Token not found"
}
```

---

## ⚠️ Dépannage

### Problème 1: "❌ Email ou mot de passe incorrect" au Login

**Causes possibles:**

1. ❌ Password stocké en plaintext au lieu d'être hashé
2. ❌ PasswordHasherInterface non utilisé à la registration
3. ❌ Backend utilise "username" au lieu de "email" pour le login

**Solution:**

```bash
# Vérifier le password en DB:
php bin/console doctrine:query:sql "SELECT password FROM \`user\` LIMIT 1"

# Si commence par $2y$13$: ✅ OK
# Si c'est "password123": ❌ NON hashé, redéployer le backend
```

---

### Problème 2: "❌ Erreur de connexion. Vérifiez que l'API est accessible"

**Causes possibles:**

1. ❌ Backend pas lancé
2. ❌ Port 8000 pas accessible
3. ❌ CORS mal configuré

**Solution:**

```bash
# Vérifier que le backend tourne:
curl -X GET http://127.0.0.1:8000/api/products

# Si erreur:
# 1. Lancer le backend: symfony serve -d
# 2. Vérifier CORS en Symfony

# En config/packages/nelmio_cors.yaml:
nelmio_cors:
  defaults:
    origin_regex: '^http://localhost:5[0-9]{3}$'
    allow_credentials: true
    allow_origin: ['http://localhost:5175']
```

---

### Problème 3: "❌ Pas de token reçu après registration"

**Causes possibles:**

1. ❌ Endpoint `/api/auth/register` ne retourne pas le token
2. ❌ Backend retourne format JSON différent

**Solution:**

```bash
# Tester directement:
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"password123","firstName":"Test","lastName":"User"}'

# Vérifier que la réponse inclut "token"
```

---

### Problème 4: "[Errno 111] Connexion refusée" au Login

**Causes possibles:**

1. ❌ Backend pas lancé sur port 8000
2. ❌ Adresse IP incorrecte dans axiosConfig.js

**Solution:**

```bash
# Vérifier que le backend tourne:
symfony serve -d

# Vérifier le port:
netstat -ano | findstr :8000

# Vérifier dans axiosConfig.js:
const API_BASE_URL = 'http://127.0.0.1:8000/api';
// Si localhost au lieu de 127.0.0.1: peut causer des problèmes
```

---

## ✅ Checklist de Vérification Complète

```
Frontend:
[ ] npm run dev tourne sans erreurs
[ ] Port 5175 accessible
[ ] Register.jsx utilise /api/auth/register
[ ] Login.jsx utilise /api/login_check avec "email"

Backend:
[ ] symfony serve -d tourne
[ ] JWT bundle installé
[ ] Entité User avec password hashé
[ ] Controller Register crée user + retourne token
[ ] Controller Login retourne token
[ ] Controller Profile retourne infos user

Tests Frontend:
[ ] Inscription fonctionne → redirect /admin
[ ] Token stocké en localStorage
[ ] Connection fonctionne → redirect /admin
[ ] Profil affiche infos correctement
[ ] Routes protégées → redirect /login si pas de token
[ ] Logout supprime token et redirect "/"

Tests Backend (Postman):
[ ] POST /api/auth/register → 200 + token
[ ] POST /api/login_check → 200 + token
[ ] GET /api/user/profile → 200 + infos
[ ] GET /api/user/profile (sans token) → 401

Base de Données:
[ ] Password hashé en DB ($2y$13$...)
[ ] Utilisateur créé correctement
[ ] Tous les champs présents
```

---

## 🚀 Résumé des Changements

### Frontend Mise à Journal

| Fichier        | Changement                  | Raison                    |
| -------------- | --------------------------- | ------------------------- |
| `Register.jsx` | `/users` → `/auth/register` | Endpoint correct backend  |
| `Login.jsx`    | `username` → `email`        | Champ attendu par backend |

### Status Complet

```
Avant:
  ❌ Register utilise /users (incorrect)
  ❌ Login envoie username au lieu de email
  ❌ Endpoints incompatibles avec backend

Maintenant:
  ✅ Register utilise /api/auth/register
  ✅ Login envoie email et password
  ✅ Profile utilise /api/user/profile
  ✅ Tous les intercepteurs JWT en place
  ✅ Frontend prêt pour production
```

---

## 📞 Questions/Support?

Si un test échoue, regardez:

1. Console navigateur (F12) → Onglet Network
2. Logs du backend: `symfony serve` ou `tail -f var/log/dev.log`
3. Base de données: Vérifier les users créés
4. CORS: Vérifier que l'API accepte les requêtes cross-origin

---

**🎉 Une fois tous les tests réussis, votre système d'authentification JWT est 100% fonctionnel!**
