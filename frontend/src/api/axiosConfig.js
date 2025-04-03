import axios from 'axios';

// Asume que tu backend corre en http://localhost:8000
// y la API está bajo /api/v1
const API_BASE_URL = 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Puedes añadir interceptores aquí si necesitas manejar tokens JWT, errores globales, etc.
// Ejemplo de interceptor de respuesta para errores:
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Manejo básico de errores
    console.error('Error en la llamada API:', error.response || error.message);
    // Podrías redirigir a login en caso de 401 Unauthorized, etc.
    return Promise.reject(error);
  }
);

export default apiClient;