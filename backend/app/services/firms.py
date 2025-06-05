import requests
from datetime import datetime, timedelta
from fastapi import HTTPException
from app.core.config import settings
from app.schemas.external.firms import (
    FIRMSFireData, 
    FIRMSFireDataFrontend
)
from app.schemas.firms import (
    TimePeriod
)
from app.schemas.responses import APIResponse, ResumenResponse, FocoCalorResponse
from typing import Dict, List, Tuple, Any
import logging
import pandas as pd
from io import StringIO
from cachetools import cached, TTLCache

logger = logging.getLogger(__name__)

firms_cache = TTLCache(maxsize=20, ttl=3600)  # 1 hora

def _kelvin_to_celsius(kelvin: float) -> float:
    if kelvin is None:
        return None
    return round(kelvin - 273.15, 1)

def _map_confidence(confidence: str | int) -> str:
    if isinstance(confidence, str):
        c = confidence.lower()
        if c == 'l':
            return "Baja"
        elif c == 'n':
            return "Nominal"
        elif c == 'h':
            return "Alta"
    elif isinstance(confidence, (int, float)):
        if confidence >= 80:
            return "Alta"
        elif confidence >= 30:
            return "Nominal"
        else:
            return "Baja"
    return "Desconocida"

def _confidence_text(conf: str) -> str:
    if conf == "Alta":
        return "El satélite está seguro de este foco"
    elif conf == "Nominal":
        return "El satélite tiene dudas, pero es posible que haya fuego"
    elif conf == "Baja":
        return "El satélite detectó algo, pero puede ser falso"
    return "Sin información"

def _temp_text(temp: float | None) -> str:
    if temp is None:
        return "Sin dato"
    if temp > 80:
        return "Muy caliente"
    elif temp > 60:
        return "Caliente"
    elif temp > 40:
        return "Tibio"
    else:
        return "Bajo"

def _intensidad_text(frp: float | None) -> str:
    if frp is None:
        return "Sin dato"
    if frp > 50:
        return "Fuego fuerte, visible desde lejos"
    elif frp > 20:
        return "Fuego de intensidad media"
    elif frp > 0:
        return "Fuego de baja intensidad"
    else:
        return "Sin fuego"

def _get_area_protegida(lat: float, lon: float) -> str | None:
    # Ejemplo simple, puedes mejorar con polígonos reales
    if -28.7 <= lat <= -28.0 and -57.8 <= lon <= -57.0:
        return "Parque Nacional Iberá"
    return None

def _combine_datetime(acq_date: str, acq_time: int) -> str | None:
    try:
        time_str = str(acq_time).zfill(4)
        dt_str = f"{acq_date}T{time_str[:2]}:{time_str[2:]}:00Z"
        dt_obj = datetime.strptime(dt_str, "%Y-%m-%dT%H:%M:%SZ")
        return dt_obj.isoformat() + "Z"
    except Exception:
        return None

class FIRMSService:
    CORRIENTES_BBOX = "-60,-31,-57,-26"
    SOURCES = {
        "recent": "VIIRS_SNPP_NRT",
        "historical": "MODIS_SP"
    }

    def __init__(self):
        self.api_key = settings.FIRMS_API_KEY
        self.base_url = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"

    def get_date_range(self, period: TimePeriod) -> Tuple[datetime, datetime]:
        today = datetime.now()
        current_year = today.year
        period_mapping = {
            TimePeriod.LAST_24H: (today - timedelta(days=1), today),
            TimePeriod.LAST_48H: (today - timedelta(days=2), today),
            TimePeriod.LAST_WEEK: (today - timedelta(weeks=1), today),
            TimePeriod.LAST_MONTH: (today - timedelta(days=30), today),
            TimePeriod.CURRENT: (datetime(current_year, 1, 1), today),
            TimePeriod.PREVIOUS: (datetime(current_year-1, 1, 1), datetime(current_year-1, 12, 31)),
            TimePeriod.YEAR_2023: (datetime(2023, 1, 1), datetime(2023, 12, 31)),
            TimePeriod.YEAR_2022: (datetime(2022, 1, 1), datetime(2022, 12, 31)),
            TimePeriod.YEAR_2021: (datetime(2021, 1, 1), datetime(2021, 12, 31))
        }
        if period not in period_mapping:
            logger.warning(f"Período no reconocido: {period}, usando últimas 24h")
            return today - timedelta(days=1), today
        return period_mapping[period]

    @cached(cache=firms_cache)
    def get_active_fires(self, period: TimePeriod) -> APIResponse:
        try:
            start_date, end_date = self.get_date_range(period)
            days = (end_date - start_date).days
            if period.value in ['2021', '2022', '2023']:
                source = self.SOURCES["historical"]
            else:
                source = self.SOURCES["recent"]
            url = f"{self.base_url}/{self.api_key}/{source}/{self.CORRIENTES_BBOX}/{days}"
            if not self.api_key:
                raise HTTPException(status_code=500, detail="API key no configurada")
            response = requests.get(url, timeout=30)
            if response.status_code != 200:
                raise HTTPException(status_code=502, detail="Error consultando FIRMS")
            lines = response.text.strip().split('\n')
            if len(lines) <= 1:
                return self._empty_response(period)
            df = pd.read_csv(StringIO(response.text))
            focos: List[FocoCalorResponse] = []
            for fire in df.to_dict('records'):
                try:
                    lat = fire['latitude']
                    lon = fire['longitude']
                    temp_k = fire.get('bright_ti4')
                    temp_c = _kelvin_to_celsius(temp_k)
                    conf = _map_confidence(fire.get('confidence'))
                    frp = fire.get('frp')
                    area = _get_area_protegida(lat, lon)
                    fecha_hora = _combine_datetime(fire.get('acq_date'), fire.get('acq_time'))
                    foco = FocoCalorResponse(
                        latitud=lat,
                        longitud=lon,
                        fecha_hora=fecha_hora or "",
                        temperatura_celsius=temp_c,
                        temperatura_texto=_temp_text(temp_c),
                        confianza=conf,
                        confianza_texto=_confidence_text(conf),
                        frp=frp,
                        intensidad_texto=_intensidad_text(frp),
                        area_protegida=area
                    )
                    focos.append(foco)
                except Exception as e:
                    logger.warning(f"Error al parsear foco: {fire} - {e}")
                    continue
            resumen = ResumenResponse(
                cantidad_focos=len(focos),
                periodo=period.value,
                fuente_datos="Satélite VIIRS" if source == "VIIRS_SNPP_NRT" else "Satélite MODIS",
                mensaje=self._mensaje_rural(len(focos), period)
            )
            return APIResponse(resumen=resumen, focos=focos)
        except Exception as e:
            logger.error(f"Error en get_active_fires: {e}", exc_info=True)
            raise HTTPException(status_code=500, detail=str(e))

    def _mensaje_rural(self, cantidad: int, period: TimePeriod) -> str:
        if cantidad == 0:
            return f"No se detectaron focos de calor en el período seleccionado ({period.value})."
        elif cantidad == 1:
            return f"Se detectó 1 foco de calor. Si está cerca, mantenga distancia y avise a un guardaparque."
        else:
            return f"Se detectaron {cantidad} focos de calor. Si está cerca de estos puntos, mantenga distancia y avise a un guardaparque."

    def _empty_response(self, period: TimePeriod) -> APIResponse:
        resumen = ResumenResponse(
            cantidad_focos=0,
            periodo=period.value,
            fuente_datos="Satélite VIIRS",
            mensaje=self._mensaje_rural(0, period)
        )
        return APIResponse(resumen=resumen, focos=[])