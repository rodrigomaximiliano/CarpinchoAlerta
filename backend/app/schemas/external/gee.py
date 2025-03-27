from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List, Dict, Any

class GEEDataRequest(BaseModel):
    """Esquema para solicitudes de datos de GEE"""
    latitude: float = Field(..., example=-28.4696, description="Latitud en decimales")
    longitude: float = Field(..., example=-65.7852, description="Longitud en decimales")
    start_date: Optional[str] = Field(
        None, 
        example="2023-01-01", 
        description="Fecha de inicio en formato YYYY-MM-DD"
    )
    end_date: Optional[str] = Field(
        None, 
        example="2023-12-31", 
        description="Fecha de fin en formato YYYY-MM-DD"
    )
    buffer_km: Optional[int] = Field(
        10, 
        ge=1, 
        le=100, 
        description="Radio del área de análisis en kilómetros"
    )

class NDVIResponse(BaseModel):
    """Respuesta de datos NDVI"""
    date: str
    ndvi_value: float = Field(..., ge=-1, le=1, description="Valor NDVI normalizado")
    quality: Optional[str] = Field(None, description="Calidad del dato")

class FireRiskResponse(BaseModel):
    """Respuesta de análisis de riesgo de incendio"""
    risk_score: float = Field(..., ge=0, le=1, description="Puntaje de riesgo (0-1)")
    temperature: float = Field(..., description="Temperatura promedio en °C")
    precipitation: float = Field(..., ge=0, description="Precipitación en mm")
    ndvi: float = Field(..., ge=-1, le=1, description="Índice NDVI promedio")
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Metadatos adicionales del análisis"
    )

class GEERawResponse(BaseModel):
    """Respuesta cruda de GEE para desarrollo"""
    data: Dict[str, Any]
    metadata: Dict[str, str]