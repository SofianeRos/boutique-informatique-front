# 🖥️ Boutique Informatique - Frontend

Plateforme e-commerce moderne pour une boutique informatique, construite avec **React**, **Vite** et **Tailwind CSS**. Cette application offre une expérience complète d'achat en ligne avec un système de gestion d'événements et un panel administrateur complet.

## 📋 Table des Matières

- [🌟 Fonctionnalités](#-fonctionnalités)
- [⚙️ Prérequis](#️-prérequis)
- [📦 Installation](#-installation)
- [🚀 Démarrage](#-démarrage)
- [📁 Structure du Projet](#-structure-du-projet)
- [🔧 Configuration](#-configuration)
- [📚 Guide d'Utilisation](#-guide-dutilisation)
- [👨‍💼 Guide d'Administration](#-guide-dadministration)
- [🛠️ Technologies](#️-technologies)
- [📝 Contribution](#-contribution)
- [❓ Support](#-support)

---

## 🌟 Fonctionnalités

### 🛍️ Pour les Clients

- ✅ **Inscription & Authentification** - Créer un compte et se connecter en toute sécurité
- ✅ **Navigation Produits** - Parcourir le catalogue avec recherche et filtres
- ✅ **Gestion du Panier** - Ajouter, modifier et supprimer des articles
- ✅ **Paiement Sécurisé** - Intégration système de paiement avec gestion des erreurs
- ✅ **Historique de Commandes** - Consulter ses anciennes commandes
- ✅ **Profil Utilisateur** - Gérer ses informations personnelles
- ✅ **Système d'Événements** - Consulter et rejoindre des événements (webinaires, formations, etc.)
- ✅ **Notifications** - Alertes en temps réel (toast notifications)
- ✅ **Pages Légales** - Mentions légales et conditions d'utilisation

### 👨‍💼 Pour les Administrateurs

- ✅ **Dashboard** - Vue d'ensemble de l'activité
- ✅ **Gestion des Produits** - Créer, modifier, supprimer des produits
- ✅ **Gestion des Utilisateurs** - Consulter et gérer les comptes utilisateurs
- ✅ **Gestion des Commandes** - Suivre et gérer les commandes
- ✅ **Gestion des Événements** - Créer et modifier des événements avec créneaux horaires
- ✅ **Contrôle d'Accès** - Système de rôles (Admin/User)

---

## ⚙️ Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés :

- **Node.js** v18.0.0 ou supérieur ([Télécharger](https://nodejs.org/))
- **npm** v9.0.0 ou supérieur (fourni avec Node.js)
- **Git** ([Télécharger](https://git-scm.com/))
- **Backend** en cours d'exécution (API Symfony PHP)

Vérifiez vos versions :

```bash
node --version
npm --version
git --version
```

---

## 📦 Installation

### 1. Cloner le Dépôt

```bash
git clone <url-du-repo>
cd boutique-informatique-front
```

### 2. Installer les Dépendances

```bash
npm install
```

Cela installera toutes les dépendances requises listées dans `package.json`.

### 3. Configurer l'API Backend

Créez ou modifiez le fichier de configuration de l'API :

**Fichier:** `src/services/axiosConfig.js`

```javascript
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://127.0.0.1:8000", // 👈 Adapter selon votre backend
  withCredentials: true,
});

// Ajouter le token JWT aux requêtes
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

---

## 🚀 Démarrage

### Mode Développement

Démarrer le serveur de développement avec Hot Module Replacement (HMR) :

```bash
npm run dev
```

L'application sera accessible à `http://localhost:5173`

### Mode Production

Créer une version optimisée pour la production :

```bash
npm run build
```

Les fichiers générés seront dans le dossier `dist/`.

Prévisualiser la build :

```bash
npm run preview
```

### Linting

Vérifier la qualité du code :

```bash
npm run lint
```

Corriger automatiquement les problèmes :

```bash
npm run lint -- --fix
```

---

## 📁 Structure du Projet

```
boutique-informatique-front/
├── src/
│   ├── assets/              # Images et ressources statiques
│   ├── components/
│   │   └── ProtectedRoute.jsx      # Composant de protection des routes
│   ├── pages/
│   │   ├── Home.jsx               # Page d'accueil
│   │   ├── Login.jsx              # Page de connexion
│   │   ├── Register.jsx           # Page d'inscription
│   │   ├── Profile.jsx            # Profil utilisateur
│   │   ├── Cart.jsx               # Panier
│   │   ├── Event.jsx              # Affichage des événements
│   │   ├── PaymentSuccess.jsx     # Paiement réussi
│   │   ├── PaymentCancel.jsx      # Paiement annulé
│   │   ├── LegalNotice.jsx        # Mentions légales
│   │   ├── Admin.jsx              # Dashboard admin
│   │   ├── AdminProducts.jsx      # Gestion produits
│   │   ├── AdminUsers.jsx         # Gestion utilisateurs
│   │   ├── AdminOrders.jsx        # Gestion commandes
│   │   └── AdminEvents.jsx        # Gestion événements
│   ├── services/
│   │   ├── axiosConfig.js         # Configuration Axios/API
│   │   └── authHelper.js          # Fonctions d'authentification
│   ├── App.jsx                # Composant principal
│   ├── main.jsx               # Point d'entrée
│   └── index.css              # Styles globaux
├── public/                    # Fichiers publics
├── package.json               # Configuration npm
├── vite.config.js            # Configuration Vite
├── eslint.config.js          # Configuration ESLint
├── index.html                # HTML principal
├── README.md                 # Ce fichier
├── CAHIER_DES_CHARGES_TODO.md # Suivi des fonctionnalités
├── ADMIN_GUIDE.md            # Guide spécifique aux admins
├── EVENTS_SYSTEM.md          # Documentation système d'événements
└── EVENTS_ADAPTER.md         # Guide de migration des événements
```

---

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env` à la racine du projet (optionnel, pour Vite) :

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_APP_NAME=Boutique Informatique
```

### Configuration Axios

Le fichier `src/services/axiosConfig.js` configure automatiquement :

- L'URL de base de l'API
- L'ajout du token JWT dans les headers
- Les intercepteurs pour les erreurs

### Tailwind CSS

Le projet utilise **Tailwind CSS** pour les styles. La configuration se trouve dans `tailwind.config.js`.

---

## 📚 Guide d'Utilisation

### 1️⃣ Inscription et Connexion

1. Cliquez sur **"S'inscrire"** ou **"Connexion"** en haut de la page
2. Remplissez le formulaire avec vos identifiants
3. Validez et reconnectez-vous pour accéder à votre compte

### 2️⃣ Navigation et Achat

1. Accédez à la **Page d'Accueil** pour voir les produits
2. Utilisez la **barre de recherche** pour trouver des produits
3. Ajoutez des articles au **panier**
4. Consultez votre panier et procédez au **paiement**
5. Suivez les instructions de paiement

### 3️⃣ Événements

1. Allez à la page **Événements** (`/events`)
2. Consultez la liste des événements disponibles
3. Cliquez sur **"Rejoindre"** pour participer

### 4️⃣ Profil Utilisateur

1. Cliquez sur **"Mon Profil"** dans le menu
2. Consultez votre **historique de commandes**
3. Modifiez vos **informations personnelles**

---

## 👨‍💼 Guide d'Administration

### Accès au Panel Admin

Pour accéder aux fonctionnalités administrateur, vous devez avoir le rôle **`ROLE_ADMIN`**.

#### ❌ Pas d'accès à `/admin` ?

```javascript
// Vérifiez vos rôles dans la console (F12)
localStorage.getItem("userRoles");

// Résultat attendu: ["ROLE_ADMIN","ROLE_USER"]
```

**Si vous n'avez pas le rôle ADMIN :**

1. Contactez le responsable du backend
2. Demandez la promotion en administrateur via la commande :
   ```bash
   php bin/console app:promote-user votre-email@example.com
   ```
3. Déconnectez-vous complètement et reconnectez-vous

### 🎯 Fonctionnalités Admin

#### Dashboard Admin (`/admin`)

Accueil avec accès rapide aux sections principales :

- 📦 Gestion Produits
- 👥 Gestion Utilisateurs
- 📋 Gestion Commandes
- 🎯 Gestion Événements

#### 📦 Gestion des Produits (`/admin/products`)

- ➕ **Créer** - Ajouter un nouveau produit
- ✏️ **Modifier** - Éditer les infos produit
- 🗑️ **Supprimer** - Retirer un produit

#### 👥 Gestion des Utilisateurs (`/admin/users`)

- 👀 **Consulter** - Liste de tous les utilisateurs
- 📧 **Email** - Voir les adresses email
- 🎫 **Rôles** - Vérifier les permissions

#### 📋 Gestion des Commandes (`/admin/orders`)

- 📊 **Suivi** - État de chaque commande
- 💰 **Montant** - Total de la commande
- 📅 **Date** - Quand la commande a été passée

#### 🎯 Gestion des Événements (`/admin/events`)

Créer et gérer les événements :

1. ➕ **Créer un événement**
   - Titre et description
   - Date limite d'inscription
   - Date limite d'événement

2. ✏️ **Modifier un événement**
   - Sélectionnez un événement
   - Modifiez les champs
   - Sauvegardez les modifications

3. 🗑️ **Supprimer un événement**
   - Suppression définitive (⚠️ irréversible)

4. 👥 **Voir les participants**
   - Liste des utilisateurs inscrits

---

## 🛠️ Technologies

| Technologie         | Version | Utilité                   |
| ------------------- | ------- | ------------------------- |
| **React**           | 19.2.4  | Framework UI              |
| **Vite**            | 8.0.1   | Build tool & dev server   |
| **Tailwind CSS**    | 4.2.2   | Framework CSS utilitaire  |
| **React Router**    | 7.13.2  | Navigation et routing     |
| **Axios**           | 1.14.0  | Client HTTP               |
| **JWT Decode**      | 4.0.0   | Décodage des tokens JWT   |
| **React Hot Toast** | 2.6.0   | Notifications utilisateur |
| **ESLint**          | 9.39.4  | Linting du code           |
| **Autoprefixer**    | 10.4.27 | Préfixes CSS automatiques |

### Architecture

```
Frontend (React)
    ↓ (Axios + JWT)
Backend API (Symfony PHP)
    ↓ (SQL)
Base de Données (MySQL/PostgreSQL)
```

---

## 📝 Contribution

Pour contribuer au projet :

1. **Fork** le dépôt
2. **Créez** une branche (`git checkout -b feature/NomFeature`)
3. **Committez** vos changements (`git commit -m 'Ajout: NomFeature'`)
4. **Poussez** vers la branche (`git push origin feature/NomFeature`)
5. **Ouvrez** une Pull Request

### Standards de Code

- Utiliser ESLint pour vérifier le code : `npm run lint`
- Respecter les conventions de nommage React
- Commenter le code complexe
- Écrire des messages de commit clairs

---

## ❓ Support

### Documentation Supplémentaire

- [CAHIER_DES_CHARGES_TODO.md](CAHIER_DES_CHARGES_TODO.md) - Suivi des fonctionnalités
- [ADMIN_GUIDE.md](ADMIN_GUIDE.md) - Guide détaillé d'administration
- [EVENTS_SYSTEM.md](EVENTS_SYSTEM.md) - Système de gestion d'événements
- [EVENTS_ADAPTER.md](EVENTS_ADAPTER.md) - Migration des événements

### Problèmes Courants

**Le serveur frontend ne démarre pas :**

```bash
# Supprimez node_modules et réinstallez
rm -rf node_modules
npm install
npm run dev
```

**Erreurs de connexion à l'API :**

- Vérifiez que le backend est en cours d'exécution
- Vérifiez l'URL dans `src/services/axiosConfig.js`
- Vérifiez les logs du navigateur (F12 → Console)

**Pas d'accès au panel admin :**

- Consultez la section [Accès au Panel Admin](#accès-au-panel-admin)

### Contact & Support

Pour signaler un bug ou demander de l'aide :

- Ouvrez une **issue** sur le dépôt
- Contactez l'équipe de développement

---

## 📄 Licence

Ce projet est propriétaire. Tous droits réservés.

---

## 🙏 Remerciements

Merci à tous les contributeurs et à la communauté React/Vite pour leurs excellentes outils et ressources.

---

**Dernière mise à jour :** Mai 2026
**Version :** 1.0.0
