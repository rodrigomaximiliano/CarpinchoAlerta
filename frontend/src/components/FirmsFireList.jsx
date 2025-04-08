import React, { useState, useEffect } from 'react';
import { getActiveFires } from '../api/firmsService';
import { Spinner, Alert, Form, ListGroup, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'; // Importar OverlayTrigger y Tooltip

// Tooltip para explicar la confianza
const confidenceTooltip = (
  <Tooltip id="tooltip-confidence">
    Nivel de confianza en la detección del foco: Baja, Nominal, Alta.
  </Tooltip>
);

// Tooltip para explicar FRP
const frpTooltip = (
  <Tooltip id="tooltip-frp">
    Potencia Radiativa del Fuego (Fire Radiative Power) en MW (Megawatts). Indica la intensidad del fuego.
  </Tooltip>
);

// Tooltip para explicar Temperatura de Brillo
const tempTooltip = (
  <Tooltip id="tooltip-temp">
    Temperatura de brillo detectada por el satélite en el canal infrarrojo (Banda I4 para VIIRS) en grados Celsius.
  </Tooltip>
);


function FirmsFireList() {
  const [fireData, setFireData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(1); // Por defecto 1 día

  useEffect(() => {
    const fetchFires = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getActiveFires(days);
        setFireData(data);
      } catch (err) {
        setError(`Error al cargar datos de FIRMS para ${days} día(s). ¿Está el backend funcionando?`);
        console.error(err);
        setFireData(null); // Limpiar datos en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchFires();
  }, [days]); // Recargar cuando cambie 'days'

  const handleDaysChange = (event) => {
    const newDays = parseInt(event.target.value, 10);
    if (newDays >= 1 && newDays <= 7) {
      setDays(newDays);
    }
  };

  const fires = fireData?.fires || [];
  // Usar el total del resumen si está disponible, si no, contar los items
  const fireCount = fireData?.summary?.total_fires ?? fires.length;
  const source = fireData?.summary?.data_source || 'N/A'; // Obtener fuente del resumen

  return (
    <div>
      <h3 className="h5 text-danger">Focos de Calor Activos (FIRMS/VIIRS)</h3>
       <p className="text-muted small">
         Muestra los focos de calor detectados recientemente por el sensor VIIRS (satélite Suomi NPP/NOAA-20)
         a través del sistema FIRMS de la NASA. Actualizado varias veces al día.
       </p>

      {/* Selector de días */}
      <Form.Group as={Row} className="mb-3 align-items-center">
        <Form.Label column sm="auto" htmlFor="days-select" className="mb-0 me-2">
          <small>Ver datos de últimos:</small>
        </Form.Label>
        <Col sm="auto">
          <Form.Select
            id="days-select"
            value={days}
            onChange={handleDaysChange}
            size="sm"
            style={{ width: '90px' }} // Ajustar ancho
            disabled={loading}
            aria-label="Seleccionar número de días"
          >
            {[1, 2, 3, 4, 5, 6, 7].map(d => (
              <option key={d} value={d}>{d} día{d > 1 ? 's' : ''}</option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>

      {/* Indicador de carga y error */}
      {loading && (
        <div className="text-center my-3">
          <Spinner animation="border" role="status" variant="primary" size="sm">
            <span className="visually-hidden">Cargando datos FIRMS...</span>
          </Spinner>
          <p className="mt-1 mb-0"><small>Cargando datos...</small></p>
        </div>
      )}
      {error && <Alert variant="warning" className="mt-3">{error}</Alert>}

      {/* Resumen y Lista (solo si no está cargando y no hay error) */}
      {!loading && !error && (
        <>
          <p className="text-muted mb-2">
            <small>Total focos ({source}) en {days} día(s): {fireCount}</small>
          </p>
          {fires.length === 0 ? (
            <Alert variant="info" className="mt-3">
              No se encontraron focos de calor activos para el período seleccionado.
            </Alert>
          ) : (
            <ListGroup variant="flush" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {fires.map((fire, index) => (
                <ListGroup.Item key={index} className="px-0 py-2">
                  <small>
                    <strong>Lat/Lon:</strong> {fire.latitude?.toFixed(4)}, {fire.longitude?.toFixed(4)} <br />
                     <OverlayTrigger placement="top" overlay={tempTooltip}>
                       <span><strong>Temp. Brillo (°C):</strong> {fire.temperature_celsius ?? 'N/A'}</span>
                     </OverlayTrigger> |{' '}
                     <OverlayTrigger placement="top" overlay={frpTooltip}>
                       <span><strong>FRP (MW):</strong> {fire.frp ?? 'N/A'}</span>
                     </OverlayTrigger> <br />
                     <OverlayTrigger placement="top" overlay={confidenceTooltip}>
                       <span><strong>Confianza:</strong> {fire.confidence_level ?? 'N/A'}</span>
                     </OverlayTrigger> <br />
                    <strong>Fecha/Hora (Local):</strong> {fire.timestamp ? new Date(fire.timestamp).toLocaleString() : 'N/A'}
                  </small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </>
      )}
    </div>
  );
}

export default FirmsFireList;