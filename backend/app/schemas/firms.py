from datetime import datetime
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict, Any
from enum import Enum

class TimePeriod(str, Enum):
    """Períodos disponibles para consultar focos de calor."""
    LAST_24H = "24h"       # Últimas 24 horas
    LAST_48H = "48h"       # Últimas 48 horas
    LAST_WEEK = "week"     # Última semana
    LAST_MONTH = "month"   # Último mes
    CURRENT = "current"    # Año en curso
    PREVIOUS = "previous"  # Año anterior
    YEAR_2023 = "2023"    # Año 2023
    YEAR_2022 = "2022"    # Año 2022
    YEAR_2021 = "2021"    # Año 2021

    @classmethod
    def get_description(cls, period: str) -> str:
        """Obtiene descripción detallada del período."""
        descriptions = {
            cls.LAST_24H: "Datos en tiempo real de las últimas 24 horas",
            cls.LAST_48H: "Datos de las últimas 48 horas",
            cls.LAST_WEEK: "Resumen semanal de focos activos",
            cls.LAST_MONTH: "Análisis mensual de focos detectados",
            cls.YEAR_CURRENT: f"Datos acumulados del año {datetime.now().year}",
            cls.YEAR_PREVIOUS: f"Datos históricos del año {datetime.now().year - 1}",
            cls.YEAR_2023: "Registro histórico completo del año 2023",
            cls.YEAR_2022: "Registro histórico completo del año 2022",
            cls.YEAR_2021: "Registro histórico completo del año 2021"
        }
        return descriptions.get(period, "Período no especificado")

    @classmethod
    def get_friendly_message(cls, period: str) -> Dict[str, Any]:
        """Obtiene mensaje amigable con detalles del período seleccionado."""
        current_year = datetime.now().year
        messages = {
            cls.LAST_24H: {
                "titulo": "Monitoreo en Tiempo Real",
                "descripcion": "Datos más recientes de las últimas 24 horas",
                "actualizacion": "Actualización cada hora",
                "uso_recomendado": "Ideal para detección temprana y respuesta inmediata",
                "fuente_datos": "Satélite VIIRS (mayor precisión)"
            },
            cls.LAST_WEEK: {
                "titulo": "Resumen Semanal",
                "descripcion": "Análisis de los últimos 7 días",
                "actualizacion": "Datos completos del período",
                "uso_recomendado": "Perfecto para análisis de tendencias recientes",
                "fuente_datos": "Combinación de fuentes satelitales"
            }
            # ... más períodos ...
        }
        return messages.get(period, {
            "titulo": "Período Personalizado",
            "descripcion": "Consulta específica de datos",
            "actualizacion": "Según disponibilidad",
            "uso_recomendado": "Análisis específico",
            "fuente_datos": "Múltiples fuentes"
        })

class ReportPeriod(str, Enum):
    """Períodos disponibles para generación de reportes."""
    LAST_24H = "24h"
    LAST_48H = "48h"
    LAST_WEEK = "week"
    LAST_MONTH = "month"

class ReportDetail(str, Enum):
    """Niveles de detalle disponibles para los reportes."""
    BASIC = "basic"
    DETAILED = "detailed"
    ANALYTICAL = "analytical"

class FIRMSFireData(BaseModel):
    """Modelo de datos para focos de calor individuales con validación estricta."""
    latitude: float = Field(..., ge=-31.0, le=-26.0)
    longitude: float = Field(..., ge=-60.0, le=-57.0)
    brightness: Optional[float] = Field(None, ge=0, le=1000)
    scan: Optional[float] = Field(None, ge=0, le=1.0)
    track: Optional[float] = Field(None, ge=0, le=1.0)
    satellite: str = Field(..., pattern="^(VIIRS_SNPP|MODIS).*")
    confidence: str | int

    model_config = {
        "extra": "forbid",  # No permite campos adicionales
        "json_schema_extra": {
            "example": {
                "latitude": -28.5532,
                "longitude": -57.3423,
                "brightness": 350.5,
                "satellite": "VIIRS_SNPP",
                "confidence": "h"
            }
        }
    }

    @validator('brightness')
    def validar_temperatura(cls, v):
        if v is not None:
            if v < 200 or v > 1000:  # Temperaturas realistas en Kelvin
                raise ValueError("Temperatura fuera de rango físico realista")
        return v

    @validator('confidence')
    def validar_confianza(cls, v):
        if isinstance(v, str) and v.lower() not in ['l', 'n', 'h']:
            raise ValueError("Nivel de confianza inválido")
        elif isinstance(v, int) and not 0 <= v <= 100:
            raise ValueError("Porcentaje de confianza fuera de rango")
        return v

class FIRMSApiSummary(BaseModel):
    """Resumen de datos de focos de calor."""
    total_fires: int = Field(..., description="Cantidad total de focos detectados")
    query_period_days: int = Field(..., description="Días incluidos en la consulta")
    data_source: str = Field(..., description="Fuente de datos satelital")
    confidence_distribution: Dict[str, int] = Field(
        default_factory=lambda: {"Alta": 0, "Normal": 0, "Baja": 0},
        description="Distribución de niveles de confianza"
    )
    period_type: str = Field(..., description="Tipo de período consultado")
    last_update: datetime = Field(
        default_factory=datetime.now,
        description="Última actualización de datos"
    )

class FIRMSApiResponse(BaseModel):
    """Respuesta completa de la API FIRMS."""
    summary: FIRMSApiSummary
    fires: List[dict]

class FIRMSReport(BaseModel):
    """Modelo para la generación de reportes de focos de calor."""
    period: ReportPeriod
    detail_level: ReportDetail
    timestamp: datetime
    total_fires: int
    active_fires: int
    confidence_levels: Dict[str, int]
    fires: List[dict]  # Usar dict en lugar de FIRMSFireDataFrontend para evitar ciclos

class DatosFoco(BaseModel):
    """
    Información detallada de un foco de calor detectado.
    
    Campos principales:
    - ubicacion: Coordenadas precisas del foco
    - temperatura: Temperatura detectada en Celsius
    - nivel_riesgo: Clasificación del riesgo (BAJO/MEDIO/ALTO)
    - fecha_deteccion: Momento exacto de la detección
    """
    ubicacion: Dict[str, float] = Field(
        ...,
        description="Coordenadas del foco",
        example={"latitud": -28.5532, "longitud": -57.3423}
    )
    temperatura: float = Field(
        ...,
        description="Temperatura en grados Celsius",
        example=45.6,
        gt=0
    )
    nivel_riesgo: str = Field(
        ...,
        description="Nivel de riesgo evaluado",
        example="ALTO"
    )
    fecha_deteccion: datetime = Field(
        ...,
        description="Momento de la detección"
    )
    
    @validator('temperatura')
    def validar_temperatura(cls, v):
        """Validación amigable de temperatura."""
        if v > 100:
            raise ValueError("¡ATENCIÓN! Temperatura extremadamente alta detectada")
        return v
