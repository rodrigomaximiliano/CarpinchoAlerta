import React, { useState, useEffect } from 'react';
import { getNdviStats, getHistoricalFires } from '../api/geeService';

function GeeDataDisplay() {
  // Estados para NDVI
  const [ndviData, setNdviData] = useState([]);
  const [ndviLoading, setNdviLoading] = useState(true);
  const [ndviError, setNdviError] = useState(null);

  // Estados para Incendios Históricos
  const [historicalFireData, setHistoricalFireData] = useState(null);
  const [historicalLoading, setHistoricalLoading] = useState(true);
  const [historicalError, setHistoricalError] = useState(null);

  // Podríamos añadir estados para las fechas si quisiéramos seleccionarlas
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    // --- Fetch NDVI Stats ---
    const fetchNdvi = async () => {
      try {
        setNdviLoading(true);
        setNdviError(null);
        // Llamar sin fechas para usar los defaults del backend (último año)
        const data = await getNdviStats();
        setNdviData(data);
      } catch (err) {
        setNdviError('Error al cargar datos NDVI de GEE. ¿Está el backend funcionando y configurado correctamente?');
        console.error("Error fetching NDVI:", err);
      } finally {
        setNdviLoading(false);
      }
    };

    // --- Fetch Historical Fires ---
    const fetchHistorical = async () => {
      try {
        setHistoricalLoading(true);
        setHistoricalError(null);
        // Llamar sin fechas para usar los defaults del backend (último año)
        const data = await getHistoricalFires();
        setHistoricalFireData(data);
      } catch (err) {
        setHistoricalError('Error al cargar datos históricos de fuego de GEE. ¿Está el backend funcionando y configurado correctamente?');
        console.error("Error fetching Historical Fires:", err);
      } finally {
        setHistoricalLoading(false);
      }
    };

    fetchNdvi();
    fetchHistorical();

  }, []); // Ejecutar solo al montar

  return (
    <div>
      <h2>Datos de Google Earth Engine</h2>

      {/* Sección NDVI */}
      <section style={{ marginBottom: '20px', padding: '10px', border: '1px solid lightblue' }}>
        <h3>Estadísticas NDVI (Último Año)</h3>
        {ndviLoading && <p>Cargando NDVI...</p>}
        {ndviError && <p style={{ color: 'red' }}>{ndviError}</p>}
        {!ndviLoading && !ndviError && (
          ndviData.length > 0 ? (
            <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {ndviData.map((item, index) => (
                <li key={index}>
                  {item.date}: NDVI Medio = {item.mean_ndvi?.toFixed(4) ?? 'N/A'}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay datos NDVI disponibles.</p>
          )
        )}
      </section>

      {/* Sección Incendios Históricos */}
      <section style={{ padding: '10px', border: '1px solid orange' }}>
        <h3>Incendios Históricos (MODIS - Último Año)</h3>
        {historicalLoading && <p>Cargando datos históricos de fuego...</p>}
        {historicalError && <p style={{ color: 'red' }}>{historicalError}</p>}
        {!historicalLoading && !historicalError && historicalFireData && (
          <div>
            <h4>Resumen:</h4>
            {historicalFireData.summary ? (
              <ul>
                <li>Período: {historicalFireData.summary.start_date} a {historicalFireData.summary.end_date}</li>
                <li>Días analizados: {historicalFireData.summary.total_days_analyzed}</li>
                <li>Días con fuego: {historicalFireData.summary.days_with_fires}</li>
                <li>Total píxeles de fuego: {historicalFireData.summary.total_fire_pixels}</li>
                <li>Máx. píxeles en un día: {historicalFireData.summary.max_pixels_in_a_day} (Fecha: {historicalFireData.summary.peak_fire_date || 'N/A'})</li>
              </ul>
            ) : <p>No hay resumen disponible.</p>}

            <h4>Datos Diarios:</h4>
            {historicalFireData.daily_data && historicalFireData.daily_data.length > 0 ? (
              <ul style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {historicalFireData.daily_data.map((item, index) => (
                  <li key={index}>
                    {item.date}: Píxeles de Fuego = {item.fire_pixel_count}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay datos diarios de fuego disponibles.</p>
            )}
          </div>
        )}
         {!historicalLoading && !historicalError && !historicalFireData && (
             <p>No se recibieron datos históricos de fuego.</p>
         )}
      </section>
    </div>
  );
}

export default GeeDataDisplay;