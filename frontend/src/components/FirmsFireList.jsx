import React, { useState, useEffect } from 'react';
import { getActiveFires } from '../api/firmsService'; // Importamos la función del servicio FIRMS

function FirmsFireList() {
  const [fireData, setFireData] = useState(null); // Estado para guardar los datos de incendios (respuesta completa)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(1); // Estado para controlar el número de días a consultar

  useEffect(() => {
    const fetchFires = async () => {
      try {
        setLoading(true);
        setError(null);
        // Llamamos al servicio pasando el número de días seleccionado
        const data = await getActiveFires(days);
        setFireData(data); // Guardamos la respuesta completa
      } catch (err) {
        setError(`Error al cargar datos de FIRMS para ${days} día(s). ¿Está el backend funcionando?`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFires();
  }, [days]); // Se vuelve a ejecutar si 'days' cambia

  // Función para cambiar el número de días
  const handleDaysChange = (event) => {
    const newDays = parseInt(event.target.value, 10);
    if (newDays >= 1 && newDays <= 7) { // Validar rango permitido por el backend
      setDays(newDays);
    }
  };

  if (loading) {
    return <p>Cargando datos de incendios (FIRMS)...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  // Asumiendo que la respuesta tiene una estructura como { count: N, fires: [...] }
  // Ajusta esto según la respuesta real de tu endpoint /firms
  const fires = fireData?.fires || [];
  const fireCount = fireData?.count ?? fires.length; // Usar count si existe, si no, la longitud del array

  return (
    <div>
      <h2>Focos de Calor Activos (FIRMS)</h2>
      <div>
        <label htmlFor="days-select">Consultar últimos días: </label>
        <select id="days-select" value={days} onChange={handleDaysChange}>
          {[1, 2, 3, 4, 5, 6, 7].map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <p>Total de focos encontrados en los últimos {days} día(s): {fireCount}</p>
      {fires.length === 0 ? (
        <p>No se encontraron focos de calor activos para el período seleccionado.</p>
      ) : (
        <ul style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
          {fires.map((fire, index) => (
            // Usar un índice como key si no hay un ID único fiable en los datos de FIRMS
            // Ajusta las propiedades según la estructura real de 'fire'
            <li key={index} style={{ marginBottom: '10px', borderBottom: '1px dashed #eee', paddingBottom: '5px' }}>
              <strong>Lat/Lon:</strong> {fire.latitude?.toFixed(4)}, {fire.longitude?.toFixed(4)} <br />
              <strong>Brillo (Kelvin):</strong> {fire.bright_ti4 ?? fire.brightness ?? 'N/A'} | <strong>FRP:</strong> {fire.frp ?? 'N/A'} <br />
              <strong>Confianza:</strong> {fire.confidence ?? 'N/A'} | <strong>Satélite:</strong> {fire.satellite ?? 'N/A'} <br />
              <strong>Fecha/Hora:</strong> {fire.acq_datetime ? new Date(fire.acq_datetime).toLocaleString() : 'N/A'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FirmsFireList;