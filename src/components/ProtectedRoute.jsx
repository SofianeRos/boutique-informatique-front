import { Navigate } from 'react-router-dom';

/**
 * Route protégée - Redirige vers login si pas de token
 */
const ProtectedRoute = ({ isAuthenticated, element }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return element;
};

export default ProtectedRoute;
