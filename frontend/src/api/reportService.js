import axiosInstance from './axiosInstance'; // Asegúrate de que la ruta sea correcta

/**
 * Crea un nuevo reporte enviando los datos al backend.
 * @param {object} reportData - Datos del reporte a crear.
 * @param {number} reportData.latitude - Latitud del reporte.
 * @param {number} reportData.longitude - Longitud del reporte.
 * @param {string} [reportData.description] - Descripción opcional.
 * @param {string} [reportData.department] - Departamento opcional.
 * @param {string} [reportData.paraje] - Paraje opcional.
 * @param {string} [reportData.photo_url] - URL de foto opcional.
 * @returns {Promise<object>} - Promesa con los datos del reporte creado.
 */
export const createReport = async (reportData) => {
  try {
    // La instancia de Axios ya debería tener el token si el usuario está logueado (configurado en checkAuth)
    const response = await axiosInstance.post('/reports', reportData);
    return response.data; // Devuelve los datos del reporte creado (incluye id, status, etc.)
  } catch (error) {
    console.error("Error al crear el reporte:", error.response?.data || error.message);
    // Lanzar un error más específico o formateado si es necesario
    throw new Error(error.response?.data?.detail || "Error al enviar el reporte al servidor.");
  }
};

// --- Funciones Adicionales (Opcional) ---

/**
 * Obtiene una lista de reportes (podría requerir permisos de admin).
 * @param {number} [skip=0] - Número de reportes a saltar (paginación).
 * @param {number} [limit=100] - Número máximo de reportes a devolver.
 * @returns {Promise<Array<object>>} - Promesa con la lista de reportes.
 */
// export const getReports = async (skip = 0, limit = 100) => {
//   try {
//     const response = await axiosInstance.get('/reports', { params: { skip, limit } });
//     return response.data;
//   } catch (error) {
//     console.error("Error al obtener reportes:", error.response?.data || error.message);
//     throw new Error(error.response?.data?.detail || "Error al obtener los reportes.");
//   }
// };

/**
 * Obtiene un reporte específico por su ID.
 * @param {number} reportId - ID del reporte a obtener.
 * @returns {Promise<object>} - Promesa con los datos del reporte.
 */
// export const getReportById = async (reportId) => {
//   try {
//     const response = await axiosInstance.get(`/reports/${reportId}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error al obtener reporte ${reportId}:`, error.response?.data || error.message);
//     throw new Error(error.response?.data?.detail || `Error al obtener el reporte ${reportId}.`);
//   }
// };