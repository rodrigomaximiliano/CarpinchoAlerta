import React, { useState, useEffect } from 'react';
import { getNdviStats, getHistoricalFires } from '../api/geeService';
import DatePicker from 'react-datepicker'; // Importar DatePicker
import 'react-datepicker/dist/react-datepicker.css'; // Importar CSS de DatePicker
import { Form, Row, Col, Button, Spinner, Alert, ListGroup } from 'react-bootstrap'; // Usar componentes de Bootstrap

// Función para formatear fecha a YYYY-MM-DD
const formatDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  const year = d.getFullYear();
  return [year, month, day].join('-');
};

function GeeDataDisplay() {
  // Estados para fechas (inicializar con el último año)
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const [startDate, setStartDate] = useState(oneYearAgo);
  const [endDate, setEndDate] = useState(today);

  // Estados para NDVI
  const [ndviData, setNdviData] = useState([]);
  const [ndviLoading, setNdviLoading] = useState(false); // Iniciar en false
  const [ndviError, setNdviError] = useState(null);

  // Estados para Incendios Históricos
  const [historicalFireData, setHistoricalFireData] = useState(null);
  const [historicalLoading, setHistoricalLoading] = useState(false); // Iniciar en false
  const [historicalError, setHistoricalError] = useState(null);

  // Función para cargar datos basada en las fechas seleccionadas
  const fetchData = async () => {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);

    if (!formattedStartDate || !formattedEndDate) {
      setNdviError("Por favor, selecciona fechas válidas.");
      setHistoricalError("Por favor, selecciona fechas válidas.");
      return;
    }

    // --- Fetch NDVI Stats ---
    setNdviLoading(true);
    setNdviError(null);
    try {
      const ndviResult = await getNdviStats(formattedStartDate, formattedEndDate);
      setNdviData(ndviResult);
    } catch (err) {
      setNdviError(`Error al cargar datos NDVI (${formattedStartDate} a ${formattedEndDate}). ¿Está el backend funcionando?`);
      console.error("Error fetching NDVI:", err);
      setNdviData([]); // Limpiar datos en caso de error
    } finally {
      setNdviLoading(false);
    }

    // --- Fetch Historical Fires ---
    setHistoricalLoading(true);
    setHistoricalError(null);
    try {
      const historicalResult = await getHistoricalFires(formattedStartDate, formattedEndDate);
      setHistoricalFireData(historicalResult);
    } catch (err) {
      setHistoricalError(`Error al cargar datos históricos de fuego (${formattedStartDate} a ${formattedEndDate}). ¿Está el backend funcionando?`);
      console.error("Error fetching Historical Fires:", err);
      setHistoricalFireData(null); // Limpiar datos en caso de error
    } finally {
      setHistoricalLoading(false);
    }
  };

  // Cargar datos al montar y cuando cambian las fechas (después de hacer clic en "Consultar")
  // useEffect(() => {
  //   fetchData(); // Cargar datos inicialmente
  // }, []); // Ya no depende de las fechas aquí, se activa con el botón

  const handleConsultarClick = () => {
    fetchData(); // Llama a la función para cargar datos con las fechas actuales
  };


  return (
    <div>
      <h2 className="mb-4">Análisis Histórico (Google Earth Engine)</h2>

      {/* Selector de Fechas */}
      <Form className="mb-4 p-3 border rounded bg-light">
        <Row className="g-3 align-items-end">
          <Col xs={12} md={5}>
            <Form.Group controlId="startDatePicker">
              <Form.Label>Fecha de Inicio:</Form.Label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                className="form-control" // Clase de Bootstrap
                wrapperClassName="d-block" // Asegura que ocupe el ancho
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={5}>
            <Form.Group controlId="endDatePicker">
              <Form.Label>Fecha de Fin:</Form.Label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate} // No permitir fecha fin anterior a inicio
                maxDate={today} // No permitir fecha fin futura
                dateFormat="dd/MM/yyyy"
                className="form-control"
                wrapperClassName="d-block"
              />
            </Form.Group>
          </Col>
          <Col xs={12} md={2}>
            <Button
              variant="primary"
              onClick={handleConsultarClick}
              disabled={ndviLoading || historicalLoading} // Deshabilitar mientras carga
              className="w-100"
            >
              {ndviLoading || historicalLoading ? (
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                'Consultar'
              )}
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Sección NDVI */}
      <section className="mb-4 p-3 border rounded">
        <h3 className="h5 text-success">Índice de Vegetación (NDVI Promedio Diario)</h3>
        <p className="text-muted small">
          Muestra el promedio diario del Índice de Vegetación de Diferencia Normalizada (NDVI) para la región,
          calculado a partir de imágenes satelitales MODIS. Valores más altos indican vegetación más densa y saludable.
        </p>
        {ndviLoading && <div className="text-center"><Spinner animation="border" variant="success" size="sm" /> Cargando NDVI...</div>}
        {ndviError && <Alert variant="warning" className="mt-2">{ndviError}</Alert>}
        {!ndviLoading && !ndviError && (
          ndviData.length > 0 ? (
            <ListGroup variant="flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {ndviData.map((item, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center py-1 px-0">
                  <small>{item.date}:</small>
                  <span className="badge bg-success rounded-pill">{item.mean_ndvi?.toFixed(4) ?? 'N/A'}</span>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="info" className="mt-2">No hay datos NDVI disponibles para el período seleccionado.</Alert>
          )
        )}
      </section>

      {/* Sección Incendios Históricos */}
      <section className="p-3 border rounded">
        <h3 className="h5 text-danger">Actividad Histórica de Fuego (MODIS)</h3>
         <p className="text-muted small">
          Presenta un resumen y el conteo diario de píxeles donde se detectó fuego activo
          utilizando datos del sensor MODIS para el período seleccionado.
        </p>
        {historicalLoading && <div className="text-center"><Spinner animation="border" variant="danger" size="sm" /> Cargando datos históricos de fuego...</div>}
        {historicalError && <Alert variant="warning" className="mt-2">{historicalError}</Alert>}
        {!historicalLoading && !historicalError && historicalFireData && (
          <div>
            <h4 className="h6 mt-3">Resumen del Período:</h4>
            {historicalFireData.summary ? (
              <ListGroup variant="flush" className="mb-3">
                 <ListGroup.Item className="py-1 px-0"><small><strong>Período:</strong> {historicalFireData.summary.start_date} a {historicalFireData.summary.end_date}</small></ListGroup.Item>
                 <ListGroup.Item className="py-1 px-0"><small><strong>Días analizados:</strong> {historicalFireData.summary.total_days_analyzed}</small></ListGroup.Item>
                 <ListGroup.Item className="py-1 px-0"><small><strong>Días con fuego detectado:</strong> {historicalFireData.summary.days_with_fires}</small></ListGroup.Item>
                 <ListGroup.Item className="py-1 px-0"><small><strong>Total píxeles de fuego:</strong> {historicalFireData.summary.total_fire_pixels}</small></ListGroup.Item>
                 <ListGroup.Item className="py-1 px-0"><small><strong>Máx. píxeles en un día:</strong> {historicalFireData.summary.max_pixels_in_a_day} (Fecha: {historicalFireData.summary.peak_fire_date || 'N/A'})</small></ListGroup.Item>
              </ListGroup>
            ) : <Alert variant="light" className="mt-2">No hay resumen disponible.</Alert>}

            <h4 className="h6">Conteo Diario de Píxeles de Fuego:</h4>
            {historicalFireData.daily_data && historicalFireData.daily_data.length > 0 ? (
              <ListGroup variant="flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {historicalFireData.daily_data.map((item, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center py-1 px-0">
                    <small>{item.date}:</small>
                    <span className="badge bg-danger rounded-pill">{item.fire_pixel_count}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <Alert variant="info" className="mt-2">No hay datos diarios de fuego disponibles para el período seleccionado.</Alert>
            )}
          </div>
        )}
         {!historicalLoading && !historicalError && !historicalFireData && (
             <Alert variant="light" className="mt-2">No se recibieron datos históricos de fuego para el período seleccionado.</Alert>
         )}
      </section>
    </div>
  );
}

export default GeeDataDisplay;