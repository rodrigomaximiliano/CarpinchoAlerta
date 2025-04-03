import apiClient from './axiosConfig';

/**
 * Obtiene la lista de alertas activas del backend.
 * @param {number} hours - El número de horas hacia atrás para buscar alertas activas (opcional, por defecto el backend podría tener uno).
 * @returns {Promise<Array<object>>} - Una promesa que resuelve a un array de objetos de alerta.
 */
export const getActiveAlerts = async (hours) => {
  try {
    // Construimos los parámetros de consulta si 'hours' se proporciona
    const params = hours ? { hours } : {};
    const response = await apiClient.get('/alerts', { params }); // Asume que el endpoint es /alerts
    return response.data; // Devuelve los datos de la respuesta (la lista de alertas)
  } catch (error) {
    // El interceptor en axiosConfig ya maneja el log del error.
    // Aquí podríamos hacer un manejo más específico si fuera necesario.
    // Por ahora, relanzamos el error para que el componente que llama lo maneje.
    throw error;
  }
};

// Aquí podrías añadir más funciones para interactuar con otros endpoints de alertas
// ej: createAlert, updateAlert, getAlertById, etc.