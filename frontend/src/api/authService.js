import apiClient from './axiosConfig';

/**
 * Registra un nuevo usuario.
 * @param {object} userData - Datos del usuario a registrar { email, password, full_name }.
 * @returns {Promise<object>} - Una promesa que resuelve al objeto del usuario creado.
 */
export const register = async (userData) => {
  try {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error en el registro:', error.response?.data || error.message);
    throw error; // Re-lanzar para manejo en el componente
  }
};

/**
 * Inicia sesión de un usuario.
 * @param {string} email - Email del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<object>} - Una promesa que resuelve al objeto token { access_token, token_type }.
 */
export const login = async (email, password) => {
  try {
    // OAuth2PasswordRequestForm espera datos de formulario, no JSON.
    // Usamos URLSearchParams para formatear los datos correctamente.
    const formData = new URLSearchParams();
    formData.append('username', email); // FastAPI espera 'username' para OAuth2PasswordRequestForm
    formData.append('password', password);

    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Guardar el token (ej. en localStorage) para futuras peticiones
    if (response.data.access_token) {
      localStorage.setItem('accessToken', response.data.access_token);
      // Configurar el header por defecto de apiClient para futuras peticiones
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
    }

    return response.data; // { access_token, token_type }
  } catch (error) {
    console.error('Error en el login:', error.response?.data || error.message);
    // Limpiar token si el login falla (podría ser un token viejo inválido)
    localStorage.removeItem('accessToken');
    delete apiClient.defaults.headers.common['Authorization'];
    throw error; // Re-lanzar para manejo en el componente
  }
};

/**
 * Cierra la sesión del usuario.
 */
export const logout = () => {
  // Eliminar token de localStorage
  localStorage.removeItem('accessToken');
  // Eliminar header de autorización de apiClient
  delete apiClient.defaults.headers.common['Authorization'];
  // Aquí podrías redirigir al usuario a la página de login o actualizar el estado global
  console.log("Usuario deslogueado.");
};

/**
 * Obtiene los datos del usuario actualmente autenticado.
 * Requiere que el token esté guardado y configurado en apiClient.
 * @returns {Promise<object>} - Una promesa que resuelve al objeto del usuario actual.
 */
export const getCurrentUser = async () => {
  try {
    // Asegurarse de que el token esté en los headers antes de llamar
    const token = localStorage.getItem('accessToken');
    if (!token) {
        // Si no hay token, no intentar la llamada y devolver null o lanzar error
        console.log("No hay token para getCurrentUser");
        return null; 
        // Opcionalmente: throw new Error("No autenticado");
    }
     // Reasegurar que el header esté presente (puede haberse perdido si se recargó la página)
    if (!apiClient.defaults.headers.common['Authorization']) {
         apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error.response?.data || error.message);
    // Si hay error (ej. token expirado), podríamos limpiar el token local
    if (error.response?.status === 401) {
        logout(); // Desloguear si el token es inválido
    }
    throw error; // Re-lanzar para manejo en el componente
  }
};

/**
 * Verifica si hay un token guardado y lo configura en Axios al cargar la app.
 * Debería llamarse una vez al inicio de la aplicación (ej. en main.jsx o App.jsx).
 */
export const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log("Token encontrado y configurado en Axios.");
    } else {
        console.log("No se encontró token guardado.");
    }
};