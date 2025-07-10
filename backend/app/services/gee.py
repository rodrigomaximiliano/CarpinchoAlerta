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

        # Obtener credenciales de la configuración
        credentials_path = settings.GEE_CREDENTIAL_PATH
        service_account_email = settings.GEE_SERVICE_ACCOUNT_EMAIL

        if not credentials_path or not service_account_email:
            logger.error("GEE_CREDENTIAL_PATH o GEE_SERVICE_ACCOUNT_EMAIL no configurados en .env")
            raise HTTPException(
                status_code=500, 
                detail="Configuración de credenciales GEE incompleta."
            )
        
        # Verificar si el archivo de credenciales existe
        if not Path(credentials_path).is_file():
             logger.error(f"Archivo de credenciales GEE no encontrado en: {credentials_path}")
             raise HTTPException(
                status_code=500, 
                detail=f"Archivo de credenciales GEE no encontrado: {credentials_path}"
            )

        logger.info(f"Asegurando inicialización de GEE usando cuenta de servicio: {service_account_email}")
        try:
            # Crear objeto de credenciales de cuenta de servicio
            credentials = ee.ServiceAccountCredentials(service_account_email, credentials_path)
            # Intentar inicializar GEE con las credenciales específicas
            ee.Initialize(credentials=credentials)
            logger.info("✅ Google Earth Engine inicializado correctamente con cuenta de servicio.")
            GEEService._initialized = True
        except Exception as e: # Capturar excepción más genérica aquí puede ser útil
            logger.error(f"Error inicializando Google Earth Engine con cuenta de servicio: {str(e)}", exc_info=True)
            GEEService._initialized = False
            # Levantar excepción o manejar como sea apropiado
            raise HTTPException(
                status_code=503,  # Service Unavailable
                detail=f"Error inicializando GEE: {str(e)}"
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
                    # Devolver el numero directamente, sin unmask.
                    # Si count es None (no hay imagen o region), esto sera manejado despues.
                    'fire_pixel_count': count 
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
    
    def calculate_nbr(self, pre_fire_date: str, post_fire_date: str, geometry: ee.Geometry = None):
        """
        Calcula el NBR (Normalized Burn Ratio) y dNBR (diferencial NBR) para un área determinada.
        
        Args:
            pre_fire_date (str): Fecha pre-incendio en formato 'YYYY-MM-dd'
            post_fire_date (str): Fecha post-incendio en formato 'YYYY-MM-dd'
            geometry (ee.Geometry, opcional): Geometría del área de interés. Si es None, se usa la geometría de Corrientes.
            
        Returns:
            dict: Diccionario con los resultados del análisis NBR
        """
        self._ensure_initialized()
        
        # Usar la geometría proporcionada o la de Corrientes por defecto
        if geometry is None:
            if GEEService._corrientes_geometry is None:
                raise HTTPException(status_code=500, detail="Geometría de Corrientes no está cargada.")
            geometry = GEEService._corrientes_geometry
        
        try:
            # Definir la colección de imágenes Landsat 8 Surface Reflectance
            # Nota: Podríamos hacer que el satélite sea configurable (Landsat 7, 8, 9, Sentinel-2, etc.)
            collection = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
            
            # Función para calcular el NBR a partir de una imagen Landsat
            def calculate_nbr_for_image(image):
                # Obtener las bandas necesarias (NIR y SWIR2)
                # Bandas de Landsat 8: B5 = NIR, B7 = SWIR2
                nir = image.select('SR_B5').multiply(0.0000275).add(-0.2)  # Escalado a reflectancia
                swir2 = image.select('SR_B7').multiply(0.0000275).add(-0.2)  # Escalado a reflectancia
                
                # Calcular NBR = (NIR - SWIR2) / (NIR + SWIR2)
                nbr = nir.subtract(swir2).divide(nir.add(swir2)).rename('NBR')
                
                # Añadir fecha como propiedad
                return nbr.set('system:time_start', image.get('system:time_start'))
            
            # Obtener imágenes pre y post incendio
            # Usamos un rango de fechas para asegurarnos de tener imágenes sin nubes
            pre_fire_start = (datetime.strptime(pre_fire_date, '%Y-%m-%d') - datetime.timedelta(days=30)).strftime('%Y-%m-%d')
            pre_fire_end = (datetime.strptime(pre_fire_date, '%Y-%m-%d') + datetime.timedelta(days=30)).strftime('%Y-%m-%d')
            
            post_fire_start = (datetime.strptime(post_fire_date, '%Y-%m-%d') - datetime.timedelta(days=30)).strftime('%Y-%m-%d')
            post_fire_end = (datetime.strptime(post_fire_date, '%Y-%m-%d') + datetime.timedelta(days=30)).strftime('%Y-%m-%d')
            
            # Obtener imágenes pre y post incendio
            pre_fire_collection = (collection.filterBounds(geometry)
                                          .filterDate(pre_fire_start, pre_fire_end)
                                          .sort('CLOUD_COVER')
                                          .limit(1))
            
            post_fire_collection = (collection.filterBounds(geometry)
                                           .filterDate(post_fire_start, post_fire_end)
                                           .sort('CLOUD_COVER')
                                           .limit(1))
            
            # Verificar que tengamos imágenes
            pre_fire_count = pre_fire_collection.size().getInfo()
            post_fire_count = post_fire_collection.size().getInfo()
            
            if pre_fire_count == 0 or post_fire_count == 0:
                raise HTTPException(
                    status_code=404,
                    detail=f"No se encontraron imágenes para las fechas especificadas. Pre-incendio: {pre_fire_count}, Post-incendio: {post_fire_count}"
                )
            
            # Calcular NBR para las imágenes seleccionadas
            pre_fire_nbr = calculate_nbr_for_image(pre_fire_collection.first())
            post_fire_nbr = calculate_nbr_for_image(post_fire_collection.first())
            
            # Calcular dNBR (diferencia entre NBR pre y post incendio)
            dnbr = pre_fire_nbr.subtract(post_fire_nbr).rename('dNBR')
            
            # Clasificar la severidad del incendio basada en dNBR
            severity = dnbr.remap(
                fromList=[-float('inf'), 0.1, 0.27, 0.44, 0.66, float('inf')],
                toList=[0, 1, 2, 3, 4],  # 0: Aumento, 1-4: Severidad baja a alta
                defaultValue=0
            ).rename('severity')
            
            # Crear un diccionario con los resultados
            results = {
                'pre_fire_date': pre_fire_date,
                'post_fire_date': post_fire_date,
                'pre_fire_nbr': pre_fire_nbr.getInfo(),
                'post_fire_nbr': post_fire_nbr.getInfo(),
                'dnbr': dnbr.getInfo(),
                'severity': severity.getInfo(),
                'geometry': geometry.getInfo() if geometry else None
            }
            
            return results
            
        except ee.EEException as e:
            logger.exception(f"Error GEE en calculate_nbr: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error al calcular el NBR: {str(e)}"
            )
        except Exception as e:
            logger.exception(f"Error inesperado en calculate_nbr: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Error interno al calcular el NBR: {str(e)}"
            )