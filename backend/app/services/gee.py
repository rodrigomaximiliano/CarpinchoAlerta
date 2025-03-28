import ee
import os
from fastapi import HTTPException
from app.core.config import settings
from pathlib import Path
import logging
from datetime import datetime, date
from app.schemas.external.gee import GEEHistoricalFireDay, GEEHistoricalSummary, GEEHistoricalApiResponse

logger = logging.getLogger(__name__)

class GEEService:
    _initialized = False
    _corrientes_geometry = None

    def __init__(self):
        pass

    def _ensure_initialized(self):
        """Asegura que GEE esté inicializado antes de usarlo. Llama a esto al inicio de cada método que use ee."""
        if GEEService._initialized:
            return

        logger.info("Asegurando inicialización de GEE...")
        try:
            # Intentar inicializar GEE
            ee.Initialize(opt_url='https://earthengine-highvolume.googleapis.com')
            logger.info("✅ Google Earth Engine inicializado correctamente.")
            GEEService._initialized = True
        except ee.EEException as e:
            logger.error(f"Error inicializando Google Earth Engine: {str(e)}")
            GEEService._initialized = False
            # Levantar excepción o manejar como sea apropiado
            raise HTTPException(
                status_code=503,  # Service Unavailable
                detail=f"Configuración inválida: {str(e)}"
            )

        # Cargar la geometría DESPUÉS de inicializar GEE exitosamente
        if GEEService._corrientes_geometry is None:
            try:
                GEEService._corrientes_geometry = ee.Geometry.Rectangle([-59.8, -30.7, -55.5, -27.1])
                logger.info("Geometría de Corrientes cargada.")
            except Exception as e:
                logger.exception(f"Error cargando geometría de Corrientes: {str(e)}")
                raise HTTPException(status_code=500, detail="Error al cargar geometría de Corrientes")

    # Renombrado y modificado para trabajar con la región de Corrientes
    def get_regional_ndvi_stats(self, start_date: str, end_date: str):
        self._ensure_initialized()
        # Asegurarse que la geometría exista
        if GEEService._corrientes_geometry is None:
            raise HTTPException(status_code=500, detail="La geometría regional no está definida.")
        logger.info(f"Iniciando get_regional_ndvi_stats para Corrientes, start={start_date}, end={end_date}")
            
        try:
            # Usar la geometría de Corrientes definida en la instancia
            geometry = GEEService._corrientes_geometry
            
            collection = (
                ee.ImageCollection('MODIS/061/MOD13A1') # Usar MODIS 500m (MOD13A1) o 1km (MOD13A2)
                .filterBounds(geometry)
                .filterDate(start_date, end_date)
                .select('NDVI')
            )
            logger.debug("Filtrando colección MODIS NDVI para Corrientes.")

            def calculate_mean_ndvi(image):
                # Escalar NDVI (viene como Int16, escalar a float -1 a 1)
                ndvi = image.select('NDVI').multiply(0.0001)
                # Calcular la media sobre la región
                stats = ndvi.reduceRegion(
                    reducer=ee.Reducer.mean(),
                    geometry=geometry,
                    scale=500, # Escala espacial en metros (ajustar según MOD13A1)
                    maxPixels=1e9
                )
                # Añadir fecha y valor medio como propiedades
                return image.set('mean_ndvi', stats.get('NDVI')).set('date', image.date().format('YYYY-MM-dd'))

            # Mapear la función sobre la colección
            ndvi_stats = collection.map(calculate_mean_ndvi)
            
            # Obtener los resultados (lista de diccionarios con fecha y ndvi medio)
            # Usar aggregate_array para obtener los valores de las propiedades
            dates = ndvi_stats.aggregate_array('date').getInfo()
            mean_ndvis = ndvi_stats.aggregate_array('mean_ndvi').getInfo()

            # Combinar resultados
            results = [{'date': d, 'mean_ndvi': n} for d, n in zip(dates, mean_ndvis) if n is not None]

            logger.info(f"Cálculo de NDVI regional completado. {len(results)} resultados.")
            return results
            
        except ee.EEException as e:
             logger.exception(f"Error GEE en get_regional_ndvi_stats: {str(e)}")
             raise HTTPException(
                status_code=500,
                detail=f"Error GEE al procesar NDVI regional: {str(e)}"
            )
        except Exception as e:
            logger.exception(f"Error inesperado en get_regional_ndvi_stats: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error interno al obtener datos NDVI regional: {str(e)}"
            )

    # Nueva función para datos históricos de incendios
    def get_historical_fire_data(self, start_date: str, end_date: str) -> GEEHistoricalApiResponse:
        """Obtiene datos históricos de focos de calor (MODIS) para Corrientes."""
        self._ensure_initialized()
        # Asegurarse que la geometría exista
        if GEEService._corrientes_geometry is None:
            raise HTTPException(status_code=500, detail="Geometría de Corrientes no está cargada.")
        logger.info(f"Iniciando get_historical_fire_data para Corrientes, start={start_date}, end={end_date}")

        try:
            # Usar la geometría de Corrientes definida en la instancia
            geometry = GEEService._corrientes_geometry
            
            # Usar el dataset correcto de detección de fuego MODIS (Terra Diario)
            fire_collection = (
                ee.ImageCollection('MODIS/061/MOD14A1') # ID Corregido
                .filterBounds(geometry)
                .filterDate(start_date, end_date)
                .select('MaxFRP') # Usar MaxFRP como indicador de fuego
            )

            # Función para contar píxeles de fuego por imagen (día)
            def count_fire_pixels(image):
                # Máscara de fuego (donde MaxFRP > 0)
                fire_mask = image.select('MaxFRP').gt(0).selfMask()
                
                # Contar los píxeles dentro de la geometría de Corrientes
                stats = fire_mask.reduceRegion(
                    reducer=ee.Reducer.count(),
                    geometry=geometry,
                    scale=1000,  # Escala MODIS
                    maxPixels=1e9
                )
                # Obtener el conteo (puede ser None si no hay píxeles)
                count = stats.get('MaxFRP') 
                
                # Devolver un Feature con la fecha y el conteo
                # Usamos ee.Feature(None, ...) para no requerir geometría
                return ee.Feature(None, {
                    'date': image.date().format('YYYY-MM-dd'),
                    'fire_pixel_count': ee.Number(count).unmask(0) # Usar unmask(0) en lugar de fillna(0)
                })

            # Aplicar la función a cada imagen
            daily_counts = fire_collection.map(count_fire_pixels)

            # Obtener la información como una lista de diccionarios
            # Esto sigue siendo una llamada a getInfo(), podría ser lenta para rangos muy largos
            limit = 366 # Limitar a aprox un año de datos diarios
            logger.info(f"Ejecutando getInfo() para obtener conteos diarios de fuego (límite: {limit})...")
            result_list = daily_counts.limit(limit).getInfo()['features']

            # Extraer solo las propiedades (diccionario)
            fire_counts_data = [f['properties'] for f in result_list]
            
            # Calcular el resumen
            total_days = len(fire_counts_data)
            days_with_fires = 0
            total_pixels = 0
            max_pixels = 0
            peak_date = None

            # Crear lista de objetos GEEHistoricalFireDay
            daily_data_list = []

            for day_data in fire_counts_data:
                count = day_data.get('fire_pixel_count', 0)
                day_date_str = day_data.get('date')
                
                # Asegurar que el tipo sea correcto para el schema
                try:
                    validated_day = GEEHistoricalFireDay(date=day_date_str, fire_pixel_count=int(count))
                    daily_data_list.append(validated_day)
                except Exception as pydantic_error:
                    logger.warning(f"Error de validación Pydantic para {day_data}: {pydantic_error}")
                    continue # Saltar este día si no valida

                # Acumular para el resumen
                if validated_day.fire_pixel_count > 0:
                    days_with_fires += 1
                    total_pixels += validated_day.fire_pixel_count
                    if validated_day.fire_pixel_count > max_pixels:
                        max_pixels = validated_day.fire_pixel_count
                        peak_date = validated_day.date
            
            # Ordenar daily_data_list por fecha (opcional pero recomendado)
            daily_data_list.sort(key=lambda x: x.date)

            summary = GEEHistoricalSummary(
                start_date=start_date,
                end_date=end_date,
                total_days_analyzed=total_days,
                days_with_fires=days_with_fires,
                total_fire_pixels=total_pixels,
                max_pixels_in_a_day=max_pixels,
                peak_fire_date=peak_date
            )

            response = GEEHistoricalApiResponse(summary=summary, daily_data=daily_data_list) # Crear el objeto de respuesta
            return response

        except ee.EEException as e:
            logger.exception(f"Error GEE en get_historical_fire_data: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error GEE al procesar datos históricos de incendios: {str(e)}"
            )
        except Exception as e:
            logger.exception(f"Error inesperado en get_historical_fire_data: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error interno al obtener datos históricos de incendios: {str(e)}"
            )