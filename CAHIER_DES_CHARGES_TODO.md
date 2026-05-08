# Suivi du Cahier des Charges - Boutique Informatique

Ce document liste les fonctionnalités implémentées et celles restant à faire, afin de vous aider à valider votre cahier des charges.

## ✅ Fonctionnalités Réalisées (D'après l'architecture actuelle)

### 1. Authentification & Utilisateurs

- [x] Inscription d'un nouvel utilisateur (`Register.jsx`)
- [x] Connexion de l'utilisateur (`Login.jsx`)
- [x] Gestion du profil utilisateur (`Profile.jsx`)
- [x] Protection des routes / Gestion des rôles (`ProtectedRoute.jsx`, `authHelper.js`)

### 2. Catalogue & Boutique

- [x] Page d'accueil / Vitrine (`Home.jsx`)
- [x] Panier d'achat (`Cart.jsx`)

### 3. Paiement & Commandes

- [x] Gestion des retours après paiement :
  - [x] Succès (`PaymentSuccess.jsx`)
  - [x] Annulation (`PaymentCancel.jsx`)

### 4. Événements (Fonctionnalité spécifique)

- [x] Affichage d'un événement (`Event.jsx`)
- [x] Système d'événements documenté (`EVENTS_SYSTEM.md`, `EVENTS_ADAPTER.md`)

### 5. Back-Office (Panel Administrateur)

- [x] Dashboard principal (`Admin.jsx`)
- [x] Gestion des produits (`AdminProducts.jsx`)
- [x] Gestion des utilisateurs (`AdminUsers.jsx`)
- [x] Gestion des commandes (`AdminOrders.jsx`)
- [x] Gestion des événements (`AdminEvents.jsx`)

---

## ⏳ Fonctionnalités Potentiellement Restantes (À vérifier/faire)

### 1. Côté Client (Front-Office)

- [ ] **Pages Produits Détaillées :** Créer une page spécifique pour voir le détail d'un produit (`ProductDetails.jsx`), si ce n'est pas géré via une modale sur l'accueil.
- [x] **Filtres et Recherche :** Barre de recherche, tri par prix ajoutés.
- [x] **Historique des commandes :** Afficher les commandes passées dans le profil utilisateur (`Profile.jsx`).
- [ ] **Mot de passe oublié :** Flux de réinitialisation de mot de passe (Envoi d'email + page de nouveau mot de passe).
- [ ] **Avis / Notes :** Possibilité de laisser un avis sur un produit ou un événement.
- [x] **Pages informatives :** Mentions légales (CGV et Contact à faire).

### 2. Optimisations & UI

- [x] **Accessibilité :** Vérifier le contraste, les balises alt, la navigation au clavier (Ajout global des attributs ARIA et labels accessibles).
- [ ] **Responsive Design :** S'assurer que le site est fluide sur mobile et tablette.
- [x] **Notifications / Feedback :** Ajouter des "Toasts" (alertes) pour informer l'utilisateur des succès/erreurs (ajout au panier, connexion échouée, retrait du panier, etc.) via `react-hot-toast`.
- [ ] **SEO :** Balises meta, optimisation pour le référencement (si le projet le requiert).

### 3. Back-Office (Compléments)

- [ ] **Statistiques / Graphiques :** Chiffre d'affaires, nombre de ventes dans `Admin.jsx`.
- [ ] **Gestion des catégories :** Pouvoir créer/modifier/supprimer des catégories de produits.

---

_Note : Cochez ces cases en remplaçant les `[ ]` par des `[x]` au fur et à mesure de votre avancée pour justifier le bon remplissage de votre cahier des charges._
