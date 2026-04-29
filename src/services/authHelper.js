/**
 * authHelper.js - Utilitaires d'authentification
 * Centralise la gestion des rôles et tokens
 */

export const authHelper = {
  /**
   * Récupère les rôles de l'utilisateur depuis localStorage
   */
  getRoles: () => {
    try {
      const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
      console.log('📋 Rôles récupérés:', roles);
      return Array.isArray(roles) ? roles : [];
    } catch (e) {
      console.error('❌ Erreur parsing rôles:', e);
      return [];
    }
  },

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  hasRole: (roleName) => {
    const roles = authHelper.getRoles();
    const hasIt = roles.includes(roleName);
    console.log(`🔍 Vérification ${roleName}:`, hasIt ? '✅' : '❌');
    return hasIt;
  },

  /**
   * Vérifie si l'utilisateur est admin
   */
  isAdmin: () => {
    return authHelper.hasRole('ROLE_ADMIN');
  },

  /**
   * Récupère le token
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Sauvegarde les rôles
   */
  setRoles: (roles) => {
    if (!Array.isArray(roles)) {
      console.error('❌ Les rôles doivent être un tableau');
      return;
    }
    localStorage.setItem('userRoles', JSON.stringify(roles));
    console.log('💾 Rôles sauvegardés:', roles);
  },

  /**
   * Diagnostic complet
   */
  diagnostic: () => {
    console.group('🔍 DIAGNOSTIC AUTHENTIFICATION');
    console.log('Token:', authHelper.getToken() ? '✅ Présent' : '❌ Absent');
    console.log('Rôles:', authHelper.getRoles());
    console.log('Est admin?:', authHelper.isAdmin() ? '✅ OUI' : '❌ NON');
    console.log('localStorage:', {
      token: localStorage.getItem('token') ? 'Présent' : 'Absent',
      userRoles: localStorage.getItem('userRoles')
    });
    console.groupEnd();
  }
};

export default authHelper;
