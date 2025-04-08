import React, { useState, useEffect } from 'react';
import { getActiveAlerts } from '../api/alertService'; // Importamos la función del servicio
import { Spinner, Alert, ListGroup, Badge } from 'react-bootstrap'; // Usar componentes Bootstrap

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
        setAlerts([]); // Limpiar datos en caso de error
      } finally {
        setLoading(false); // Terminamos de cargar (con éxito o error)
      }
    };

    fetchAlerts(); // Llamamos a la función al montar el componente
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  // Función para determinar el color del Badge según la severidad
  const getSeverityBadgeVariant = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'alta': return 'danger';
      case 'media': return 'warning';
      case 'baja': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <h3 className="h5 text-warning">Alertas del Sistema</h3>
       <p className="text-muted small">
         Muestra alertas generadas por el sistema basadas en la detección de posibles riesgos
         o eventos significativos (ej. focos de calor persistentes, cercanía a zonas sensibles).
         <br/><em>(Funcionalidad futura)</em>
       </p>

      {/* Indicador de carga y error */}
      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" role="status" variant="warning" size="sm">
            <span className="visually-hidden">Cargando alertas...</span>
          </Spinner>
           <p className="mt-1 mb-0"><small>Cargando alertas...</small></p>
        </div>
      )}
      {error && <Alert variant="warning" className="mt-3">{error}</Alert>}

      {/* Lista de Alertas (solo si no está cargando y no hay error) */}
      {!loading && !error && (
        alerts.length === 0 ? (
          <Alert variant="light" className="mt-3 text-center">
            No hay alertas activas en este momento.
          </Alert>
        ) : (
          <ListGroup variant="flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {alerts.map((alert) => (
              <ListGroup.Item key={alert.id} className="px-0 py-2">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <small>
                      <strong>ID:</strong> {alert.id} ({alert.status ?? 'N/A'}) <br />
                      <strong>Descripción:</strong> {alert.description || 'Sin descripción'} <br />
                      <strong>Ubicación:</strong> Lat: {alert.latitude?.toFixed(4)}, Lon: {alert.longitude?.toFixed(4)} <br />
                      <strong>Fecha:</strong> {alert.created_at ? new Date(alert.created_at).toLocaleString() : 'N/A'}
                    </small>
                  </div>
                  <Badge
                    bg={getSeverityBadgeVariant(alert.severity)}
                    pill
                    className="ms-2"
                  >
                    {alert.severity || 'N/A'}
                  </Badge>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )
      )}
    </div>
  );
}

export default AlertList;