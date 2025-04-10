import React, { useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Reutilizar la configuración del icono si es necesario
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Props:
// - center: Array [lat, lng] para el centro inicial
// - zoom: Número para el zoom inicial
// - markers: Array de objetos { position: [lat, lng], popupText: "Texto" } (opcional)
// - style: Objeto de estilo para el contenedor del mapa

function InteractiveMapDisplay({
  center = [-28.5, -58.0], // Centro aproximado de Corrientes
  zoom = 7,
  markers = [],
  style = { height: '400px', width: '100%' }
}) {
  const mapRef = useRef();

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={style}
      whenCreated={mapInstance => { mapRef.current = mapInstance }}
      className="rounded border shadow-sm" // Añadir algo de estilo
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* Renderizar marcadores si se proporcionan */}
      {markers.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          {marker.popupText && <Popup>{marker.popupText}</Popup>}
        </Marker>
      ))}
      {/* Podríamos añadir aquí capas adicionales como FIRMS si quisiéramos */}
    </MapContainer>
  );
}

export default InteractiveMapDisplay;