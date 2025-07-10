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

# Schemas for Historical Fire Pixel Count API

class GEEHistoricalFireDay(BaseModel):
    """Schema for a single day's fire pixel count from GEE."""
    date: str  # Format YYYY-MM-DD
    fire_pixel_count: int

class GEEHistoricalSummary(BaseModel):
    """Schema for the summary of GEE historical fire data."""
    start_date: str
    end_date: str
    total_days_analyzed: int
    days_with_fires: int
    total_fire_pixels: int
    max_pixels_in_a_day: int
    peak_fire_date: str | None # Date with the maximum pixels

class GEEHistoricalApiResponse(BaseModel):
    """Schema for the complete API response for GEE historical fires."""
    summary: GEEHistoricalSummary
    daily_data: List[GEEHistoricalFireDay]

# Schemas for NBR (Normalized Burn Ratio) Analysis

class NBRResult(BaseModel):
    """Schema for a single NBR calculation result."""
    date: str = Field(..., description="Fecha de la imagen en formato YYYY-MM-dd")
    nbr_value: float = Field(..., description="Valor del índice NBR")
    dNBR: Optional[float] = Field(None, description="Diferencial NBR (pre-fuego vs post-fuego)")
    severity: Optional[str] = Field(None, description="Severidad del daño por incendio (si aplica)")
    geometry: Optional[Dict[str, Any]] = Field(None, description="Geometría del área analizada")

class NBRAnalysisResponse(BaseModel):
    """Schema for NBR analysis API response."""
    pre_fire_date: str = Field(..., description="Fecha de la imagen pre-incendio")
    post_fire_date: str = Field(..., description="Fecha de la imagen post-incendio")
    results: List[NBRResult] = Field(..., description="Resultados del análisis NBR")
    metadata: Dict[str, Any] = Field(
        default_factory=dict,
        description="Metadatos adicionales del análisis"
    )