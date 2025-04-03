import React, { useState, useEffect } from 'react';
import { getActiveAlerts } from '../api/alertService'; // Importamos la función del servicio

function AlertList() {
  const [alerts, setAlerts] = useState([]); // Estado para guardar las alertas
  const [loading, setLoading] = useState(true); // Estado para indicar si está cargando
  const [error, setError] = useState(null); // Estado para guardar errores

  useEffect(() => {
    // Función asíncrona para cargar las alertas
    const fetchAlerts = async () => {
      try {
        setLoading(true); // Empezamos a cargar
        setError(null); // Reseteamos errores previos
        // Llamamos a la función del servicio (podríamos pasar 'hours' si quisiéramos)
        const data = await getActiveAlerts();
        setAlerts(data); // Guardamos las alertas en el estado
      } catch (err) {
        setError('Error al cargar las alertas. ¿Está el backend funcionando?'); // Guardamos el mensaje de error
        console.error(err); // Logueamos el error completo en consola
      } finally {
        setLoading(false); // Terminamos de cargar (con éxito o error)
      }
    };

    fetchAlerts(); // Llamamos a la función al montar el componente
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Renderizado condicional basado en los estados
  if (loading) {
    return <p>Cargando alertas...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  return (
    <div>
      <h2>Alertas Activas</h2>
      {alerts.length === 0 ? (
        <p>No hay alertas activas en este momento.</p>
      ) : (
        <ul>
          {alerts.map((alert) => (
            // Asumiendo que cada alerta tiene un 'id' y 'description' o similar
            // Ajusta las propiedades según la estructura real de tus alertas
            <li key={alert.id}>
              <strong>ID:</strong> {alert.id} - <strong>Severidad:</strong> {alert.severity} ({alert.status}) <br />
              <strong>Descripción:</strong> {alert.description || 'N/A'} <br />
              <strong>Ubicación:</strong> Lat: {alert.latitude}, Lon: {alert.longitude} <br />
              <strong>Fecha:</strong> {new Date(alert.created_at).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AlertList;