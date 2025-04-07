import React, { useState, useEffect } from 'react'; // Importar useState y useEffect
import { Routes, Route } from 'react-router-dom'; // Importar Routes y Route
import './App.css'; // Mantener si hay estilos globales específicos aquí
import AppNavbar from './components/Navbar'; // Importar AppNavbar (renombrado)
import HomePage from './pages/HomePage'; // Importar páginas
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute'; // Importar ProtectedRoute
import { checkAuth, logout, getCurrentUser } from './api/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true); // Estado para la carga inicial

  // Verificar autenticación al cargar la app
  useEffect(() => {
    const verifyAuth = async () => {
      setIsLoadingAuth(true);
      checkAuth(); // Configura el token en Axios si existe
      try {
        const user = await getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsAuthenticated(true);
        } else {
          // Si getCurrentUser devuelve null (sin token) o falla con 401 (token inválido)
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (error) {
        // Error al obtener el usuario (ej. token expirado)
        console.error("Error verificando auth:", error);
        setIsAuthenticated(false);
        setCurrentUser(null);
        // logout(); // Asegurarse de limpiar el token si falla la verificación
      } finally {
         setIsLoadingAuth(false);
      }
    };
    verifyAuth();
  }, []);

  const handleLoginSuccess = async () => {
    setIsLoadingAuth(true); // Mostrar carga mientras se obtiene el usuario
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
      setIsAuthenticated(true);
    } catch (error) {
       console.error("Error post-login al obtener usuario:", error);
       // Mantener como no autenticado si falla la obtención del usuario
       setIsAuthenticated(false);
       setCurrentUser(null);
       logout(); // Desloguear si no se pudo obtener el usuario post-login
    } finally {
        setIsLoadingAuth(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (isLoadingAuth) {
      // Usar un spinner de Bootstrap o un texto centrado
      return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Verificando autenticación...</span>
          </div>
        </div>
      );
  }

  return (
    // Remover clases de Tailwind, usar d-flex flex-column min-vh-100 de Bootstrap
    <div className="d-flex flex-column min-vh-100"> {/* Layout principal */}
      <AppNavbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <main className="flex-grow-1"> {/* Contenido principal - usar flex-grow-1 */}
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/login"
            element={<LoginPage onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* Aquí se podrían añadir más rutas protegidas */}
          </Route>

          {/* Ruta Catch-all para 404 (Opcional) */}
          <Route path="*" element={<div className="container text-center py-5"><h2>Página no encontrada (404)</h2></div>} />
        </Routes>
      </main>
      
       {/* Footer con clases de Bootstrap */}
       <footer className="bg-dark text-white p-3 text-center mt-auto">
         © 2025 Guardián del Iberá
       </footer>
    </div>
  );
}

export default App
