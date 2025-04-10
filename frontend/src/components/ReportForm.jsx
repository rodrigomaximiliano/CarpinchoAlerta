import React, { useState, useEffect, useRef } from 'react'; // Añadir useEffect, useRef
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet'; // Importar Leaflet para el icono personalizado
import { createReport } from '../api/reportService';

// --- Configuración del Icono Personalizado (Soluciona problema con icono por defecto) ---
// Eliminar esto si el icono por defecto funciona o si prefieres usar el default
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
// --- Fin Configuración Icono ---

// Componente interno para manejar eventos del mapa
function MapClickHandler({ onMapClick, position }) {
  const map = useMapEvents({
    click(e) {
      onMapClick(e.latlng); // Llama a la función del padre con las coordenadas
    },
  });

  // Centrar mapa en la posición si cambia (ej. al seleccionar)
  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom());
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Ubicación seleccionada para el reporte</Popup>
    </Marker>
  );
}


function ReportForm() {
  const [position, setPosition] = useState(null); // Estado para la posición del marcador [lat, lng]
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef(); // Referencia al mapa

  // Coordenadas del centro inicial del mapa (Corrientes Capital aprox.)
  const initialCenter = [-27.467, -58.833];
  const initialZoom = 9; // Zoom inicial

  const handleMapClick = (latlng) => {
    setPosition([latlng.lat, latlng.lng]); // Guardar posición [lat, lng]
    setError(null); // Limpiar error si había por falta de ubicación
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!position) {
      setError('Por favor, marca la ubicación en el mapa haciendo clic.');
      return;
    }

    setLoading(true);
    try {
      const reportData = {
        latitude: position[0], // Latitud desde el estado 'position'
        longitude: position[1], // Longitud desde el estado 'position'
        description: description || null,
      };
      const createdReport = await createReport(reportData);
      setSuccess(`Reporte #${createdReport.id} enviado con éxito. ¡Gracias!`);
      setPosition(null); // Resetear marcador
      setDescription(''); // Resetear descripción
    } catch (err) {
      setError(err.message || 'Ocurrió un error al enviar el reporte.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* --- Mapa Interactivo --- */}
      <Form.Group className="mb-3">
        <Form.Label>1. Marca la Ubicación del Foco Ígneo en el Mapa:</Form.Label>
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          style={{ height: '350px', width: '100%' }} // Ajustar altura
          whenCreated={ mapInstance => { mapRef.current = mapInstance } } // Guardar referencia
          className="rounded border" // Estilos Bootstrap
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onMapClick={handleMapClick} position={position} />
        </MapContainer>
        <Form.Text className="text-muted">
          Haz clic en el mapa para colocar un marcador en la ubicación exacta.
        </Form.Text>
        {/* Mostrar coordenadas seleccionadas */}
        {position && (
          <div className="mt-2 alert alert-info py-1 px-2 small">
            <strong>Ubicación seleccionada:</strong> Lat: {position[0].toFixed(5)}, Lon: {position[1].toFixed(5)}
          </div>
        )}
      </Form.Group>
      {/* --- Fin Mapa Interactivo --- */}

      <Form.Group className="mb-3" controlId="reportDescription">
        <Form.Label>2. Añade una Descripción (Opcional):</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalles como tamaño, humo, vegetación, etc."
        />
      </Form.Group>

      {/* Mensajes de Éxito/Error */}
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Button variant="primary" type="submit" disabled={loading || !position} className="w-100">
        {loading ? (
          <>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            {' Enviando Reporte...'}
          </>
        ) : (
          'Enviar Reporte'
        )}
      </Button>
    </Form>
  );
}

export default ReportForm;