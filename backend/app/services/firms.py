import requests
from datetime import datetime, timedelta
from fastapi import HTTPException
from app.core.config import settings
from app.schemas.external.firms import FIRMSFireData, FIRMSFireDataFrontend, FIRMSApiResponse, FIRMSApiSummary
from typing import List
import logging
import pandas as pd
from io import StringIO
from pathlib import Path

logger = logging.getLogger(__name__)

def _kelvin_to_celsius(kelvin: float) -> float:
    """Convierte temperatura de Kelvin a Celsius y redondea a 1 decimal."""
    if kelvin is None:
        return None
    celsius = kelvin - 273.15
    return round(celsius, 1)

def _map_confidence(confidence: str | int) -> str:
    """Mapea el valor de confianza de FIRMS a un texto descriptivo."""
    if isinstance(confidence, str):
        confidence_str = confidence.lower()
        if confidence_str == 'l':
            return "Baja"
        elif confidence_str == 'n':
            return "Nominal"
        elif confidence_str == 'h':
            return "Alta"
    elif isinstance(confidence, (int, float)): # A veces viene como número 0-100
        if confidence >= 80:
            return "Alta"
        elif confidence >= 30:
            return "Nominal"
        else:
            return "Baja"
    return "Desconocida" # Si no coincide

def _combine_datetime(acq_date: str, acq_time: int) -> str | None:
    """Combina fecha (YYYY-MM-DD) y hora (HHMM como int) en ISO 8601 UTC."""
    try:
        # Convertir acq_time a string y asegurarse que tenga 4 dígitos
        time_str = str(acq_time).zfill(4) # <- Convertido a str antes de zfill
        dt_str = f"{acq_date}T{time_str[:2]}:{time_str[2:]}:00Z"
        # Validar y formatear (esto podría fallar si las fechas/horas son inválidas)
        dt_obj = datetime.strptime(dt_str, "%Y-%m-%dT%H:%M:%SZ")
        return dt_obj.isoformat() + "Z" # Asegura el formato ISO con Z
    except ValueError:
        logger.warning(f"Error al combinar fecha {acq_date} y hora {acq_time}. Se devolverá null.", exc_info=True)
        return None # O devolver una cadena indicando error

class FIRMSService:
    """Servicio para interactuar con la API de NASA FIRMS."""
    # BBOX Ampliado: min_lat, min_lon, max_lat, max_lon
    CORRIENTES_BBOX = "-60,-31,-57,-26" # lon_min, lat_min, lon_max, lat_max
    DEFAULT_SOURCE = "VIIRS_SNPP_NRT" 
    DEFAULT_DAYS = 7 # Usar 7 días por defecto para depuración

    def __init__(self):
        """Inicializa el servicio FIRMS."""
        self.api_key = settings.FIRMS_API_KEY
        self.base_url = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"

    def get_active_fires(self, days: int = 1, source: str = DEFAULT_SOURCE) -> FIRMSApiResponse:
        """Obtiene focos de calor activos, los formatea y devuelve una respuesta con resumen."""
        if not 1 <= days <= 7:
            raise HTTPException(status_code=400, detail="El número de días debe estar entre 1 y 7")

        if not self.api_key:
            logger.error("FIRMS_API_KEY no encontrada en la configuración.")
            raise HTTPException(status_code=500, detail="Configuración de API FIRMS incompleta")

        url = f"{self.base_url}/{self.api_key}/{source}/{self.CORRIENTES_BBOX}/{days}"
        logger.info(f"Consultando FIRMS API: {url}") # Log URL

        try:
            response = requests.get(url, timeout=30) # Aumentar timeout
            response.raise_for_status() 
            logger.info(f"FIRMS API respondió con estado: {response.status_code}")
            response_text = response.text
            # Loguear inicio de respuesta para depuración
            logger.debug(f"Respuesta FIRMS (inicio): {response_text[:500]}") 

            # Verificar si la respuesta está vacía o solo tiene encabezado
            lines = response_text.strip().split('\n')
            if len(lines) <= 1:
                logger.info("Respuesta FIRMS vacía o solo encabezado. No hay incendios reportados.")
                return FIRMSApiResponse(summary=FIRMSApiSummary(total_fires=0, query_period_days=days, data_source=source), fires=[])

            # Procesamiento de datos
            raw_text = response_text
            num_lines = len(lines)
            logger.info(f"FIRMS API devolvió {num_lines} líneas (incluyendo encabezado).")
            
            # Loguear respuesta completa si está en modo DEBUG
            logger.debug(f"FIRMS API Response Content:\n{raw_text}")

            # Convertir texto a DataFrame
            try:
                df = pd.read_csv(StringIO(raw_text))
            except pd.errors.EmptyDataError:
                logger.info("Respuesta FIRMS vacía. No hay incendios reportados.")
                return FIRMSApiResponse(summary=FIRMSApiSummary(total_fires=0, query_period_days=days, data_source=source), fires=[])
            except pd.errors.ParserError as csv_error:
                logger.error(f"Error al procesar CSV de FIRMS: {csv_error}", exc_info=True)
                raise HTTPException(status_code=500, detail="Error procesando respuesta de FIRMS")

            # Convertir DataFrame a lista de diccionarios
            raw_fire_data = df.to_dict('records')

            # Mapear y transformar los datos al formato Frontend
            formatted_fires = []
            for fire in raw_fire_data:
                try:
                    # Validar datos brutos con el schema FIRMSFireData
                    raw_model = FIRMSFireData(**fire)
                    
                    # Combinar fecha y hora
                    timestamp = _combine_datetime(raw_model.acq_date, raw_model.acq_time)
                    if not timestamp: # Si falla la combinación, saltar este registro
                        continue

                    # Mapear confianza
                    confidence_level = _map_confidence(raw_model.confidence)

                    # Convertir temperatura
                    temperature_celsius = _kelvin_to_celsius(raw_model.bright_ti4)

                    formatted_fires.append(
                        FIRMSFireDataFrontend(
                            latitude=round(raw_model.latitude, 5),
                            longitude=round(raw_model.longitude, 5),
                            timestamp=timestamp,
                            confidence_level=confidence_level,
                            temperature_celsius=temperature_celsius,
                            frp=round(raw_model.frp, 2) if raw_model.frp is not None else None
                        )
                    )
                except Exception as parse_error:
                    logger.warning(f"Error al parsear registro FIRMS: {fire}. Error: {parse_error}", exc_info=True)
                    continue # Saltar registros que no se pueden parsear

            # Crear el objeto de respuesta con resumen y lista
            summary = FIRMSApiSummary(
                total_fires=len(formatted_fires),
                query_period_days=days,
                data_source=source
            )
            response_data = FIRMSApiResponse(
                summary=summary,
                fires=formatted_fires
            )

            logger.info(f"Procesamiento FIRMS completado. {summary.total_fires} focos encontrados en {days} día(s) usando {source}.")
            return response_data

        except requests.exceptions.RequestException as e:
            logger.error(f"Error en la solicitud a FIRMS API: {e}", exc_info=True)
            raise HTTPException(status_code=502, detail="Error de comunicación con el servicio externo de incendios.")