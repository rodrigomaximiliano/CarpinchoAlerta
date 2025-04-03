import apiClient from './axiosConfig';

/**
 * Obtiene los datos de focos de calor activos de FIRMS desde el backend.
 * @param {number} days - El número de días hacia atrás para consultar (1-7, según el backend).
 * @returns {Promise<object>} - Una promesa que resuelve al objeto de respuesta de la API FIRMS.
 *                            La estructura exacta dependerá de tu backend (ej: { count: N, fires: [...] }).
 */
export const getActiveFires = async (days = 1) => { // Valor por defecto 1 día
  try {
    // El endpoint del backend '/firms' espera 'days' como query parameter.
    const response = await apiClient.get('/firms', {
      params: { days }
    });
    return response.data; // Devuelve la respuesta completa del backend
  } catch (error) {
    // El interceptor en axiosConfig ya maneja el log básico.
    console.error('Error específico al obtener datos de FIRMS:', error);
    throw error; // Re-lanzar para que el componente pueda manejarlo.
  }
};