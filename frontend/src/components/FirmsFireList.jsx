import React, { useState, useEffect } from 'react';
import { getActiveFires } from '../api/firmsService';
import { Spinner, Alert, Form, ListGroup, Row, Col } from 'react-bootstrap'; // Importar componentes

function FirmsFireList() {
  const [fireData, setFireData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(1);

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
      } finally {
        setLoading(false);
      }
    };

    fetchFires();
  }, [days]);

  const handleDaysChange = (event) => {
    const newDays = parseInt(event.target.value, 10);
    if (newDays >= 1 && newDays <= 7) {
      setDays(newDays);
    }
  };

  if (loading) {
    return (
      <div className="text-center my-3">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando datos de incendios (FIRMS)...</span>
        </Spinner>
        <p className="mt-2">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger" className="mt-3">{error}</Alert>;
  }

  const fires = fireData?.fires || [];
  const fireCount = fireData?.summary?.total_fires ?? fires.length;

  return (
    <div>
      {/* Selector de días */}
      <Form.Group as={Row} className="mb-3 align-items-center">
        <Form.Label column sm="auto" htmlFor="days-select" className="mb-0">
          Consultar últimos días:
        </Form.Label>
        <Col sm="auto">
          <Form.Select
            id="days-select"
            value={days}
            onChange={handleDaysChange}
            size="sm"
            style={{ width: '80px' }} // Ajustar ancho si es necesario
            disabled={loading}
          >
            {[1, 2, 3, 4, 5, 6, 7].map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Form.Select>
        </Col>
      </Form.Group>

      {/* Resumen y Lista */}
      <p className="text-muted mb-2">Total de focos encontrados en los últimos {days} día(s): {fireCount}</p>
      {fires.length === 0 ? (
        <Alert variant="info" className="mt-3">
          No se encontraron focos de calor activos para el período seleccionado.
        </Alert>
      ) : (
        <ListGroup style={{ maxHeight: '300px', overflowY: 'auto' }} variant="flush">
          {fires.map((fire, index) => (
            <ListGroup.Item key={index} className="px-0 py-2">
              <small>
                <strong>Lat/Lon:</strong> {fire.latitude?.toFixed(4)}, {fire.longitude?.toFixed(4)} <br />
                <strong>Brillo (K):</strong> {fire.bright_ti4 ?? fire.brightness ?? 'N/A'} | <strong>FRP:</strong> {fire.frp ?? 'N/A'} <br />
                <strong>Conf:</strong> {fire.confidence ?? 'N/A'} | <strong>Sat:</strong> {fire.satellite ?? 'N/A'} <br />
                <strong>Fecha/Hora:</strong> {fire.acq_datetime ? new Date(fire.acq_datetime).toLocaleString() : 'N/A'}
              </small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </div>
  );
}

export default FirmsFireList;