import { Navigate } from 'react-router-dom';

/**
 * Route protégée - Redirige vers login si pas de token
 * Peut vérifier un rôle spécifique si requiredRole est fourni
 */
const ProtectedRoute = ({ isAuthenticated, element, requiredRole = null, userRoles = [] }) => {
  // Debug
  const debugInfo = {
    isAuthenticated,
    requiredRole,
    userRoles,
    hasRequiredRole: requiredRole ? userRoles.includes(requiredRole) : true
  };

  console.log('🔐 PROTECTED ROUTE CHECK:', {
    path: window.location.pathname,
    isAuthenticated,
    requiredRole,
    userRoles,
    hasRole: requiredRole ? userRoles.includes(requiredRole) : 'N/A'
  });

  if (!isAuthenticated) {
    console.log('❌ PROTECTED ROUTE - Pas d\'authentification, redirection vers /login', debugInfo);
    return <Navigate to="/login" replace />;
  }

  // Vérifier le rôle si requis
  if (requiredRole && !userRoles.includes(requiredRole)) {
    console.log('❌ PROTECTED ROUTE - Rôle insuffisant, redirection vers /home', debugInfo);
    console.log('   ❌ Rôle requis:', requiredRole);
    console.log('   ❌ Rôles actuels:', userRoles);
    console.log('   ❌ Rôles actuels (stringify):', JSON.stringify(userRoles));
    return <Navigate to="/home" replace />;
  }

  console.log('✅ PROTECTED ROUTE - Accès autorisé', debugInfo);
  return element;
};

export default ProtectedRoute;
