from datetime import datetime
from pydantic import BaseModel
from typing import List

class FIRMSFireData(BaseModel):
    # Campos principales devueltos por la API CSV de VIIRS
    latitude: float
    longitude: float
    bright_ti4: float # Temperatura de brillo banda I4 (Kelvin)
    acq_date: str # Formato YYYY-MM-DD
    acq_time: int # Formato HHMM
    confidence: str | int # Puede ser 'l', 'n', 'h' o numérico 0-100
    frp: float # Potencia Radiativa del Fuego
    # Otros campos opcionales que podrían venir:
    scan: float | None = None
    track: float | None = None
    satellite: str | None = None
    version: str | None = None
    bright_ti5: float | None = None # Temperatura de brillo banda I5 (Kelvin)
    daynight: str | None = None # 'D' o 'N'

    # No necesitamos configuración especial de pydantic aquí
    # class Config:
    #     orm_mode = True # Si se usara con ORM

# Nuevo Schema para la respuesta final al Frontend
class FIRMSFireDataFrontend(BaseModel):
    latitude: float
    longitude: float
    timestamp: str # Combinado date/time en formato ISO 8601
    confidence_level: str # Descripción textual ('Baja', 'Nominal', 'Alta')
    temperature_celsius: float | None # Convertido a Celsius
    frp: float | None # Potencia Radiativa del Fuego

# Schema para el resumen
class FIRMSApiSummary(BaseModel):
    total_fires: int
    query_period_days: int
    data_source: str

# Schema para la respuesta completa de la API
class FIRMSApiResponse(BaseModel):
    summary: FIRMSApiSummary
    fires: List[FIRMSFireDataFrontend]