import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Este componente verifica si el usuario está autenticado.
// Si lo está, renderiza el contenido anidado (Outlet).
// Si no, redirige a la página de login.
function ProtectedRoute({ isAuthenticated, redirectPath = '/login' }) {
  if (!isAuthenticated) {
    // Redirigir al usuario a la página de login si no está autenticado
    return <Navigate to={redirectPath} replace />;
    // 'replace' evita que la ruta protegida quede en el historial del navegador
  }

  // Si está autenticado, renderizar el componente hijo (la página protegida)
  return <Outlet />;
}

export default ProtectedRoute;