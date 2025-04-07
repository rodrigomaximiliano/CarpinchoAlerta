import apiClient from './axiosConfig';

/**
 * Obtiene estadísticas de NDVI regional desde el backend.
 * @param {string} [startDate] - Fecha de inicio (YYYY-MM-DD). Opcional.
 * @param {string} [endDate] - Fecha de fin (YYYY-MM-DD). Opcional.
 * @returns {Promise<Array<object>>} - Una promesa que resuelve a un array de objetos { date: string, mean_ndvi: number }.
 */
export const getNdviStats = async (startDate, endDate) => {
  try {
    // Construir parámetros de consulta solo si las fechas se proporcionan
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await apiClient.get('/gee/ndvi-stats', { params });
    return response.data; // Devuelve la lista de estadísticas NDVI
  } catch (error) {
    console.error('Error específico al obtener datos NDVI de GEE:', error);
    throw error; // Re-lanzar para que el componente pueda manejarlo.
  }
};

/**
 * Obtiene datos históricos de focos de calor desde el backend (GEE).
 * @param {string} [startDate] - Fecha de inicio (YYYY-MM-DD). Opcional.
 * @param {string} [endDate] - Fecha de fin (YYYY-MM-DD). Opcional.
 * @returns {Promise<object>} - Una promesa que resuelve al objeto de respuesta de la API GEE histórica
 *                            (ej: { summary: {...}, daily_data: [...] }).
 */
export const getHistoricalFires = async (startDate, endDate) => {
  try {
    // Construir parámetros de consulta solo si las fechas se proporcionan
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const response = await apiClient.get('/gee/historical-fires', { params });
    return response.data; // Devuelve la respuesta completa del backend
  } catch (error) {
    console.error('Error específico al obtener datos históricos de fuego de GEE:', error);
    throw error; // Re-lanzar para que el componente pueda manejarlo.
  }
};