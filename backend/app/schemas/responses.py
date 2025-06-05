from pydantic import BaseModel, Field
from typing import List

class FocoCalorResponse(BaseModel):
    """Respuesta para un foco de calor detectado"""
    latitud: float = Field(..., description="Latitud del foco detectado")
    longitud: float = Field(..., description="Longitud del foco detectado")
    fecha_hora: str = Field(..., description="Fecha y hora de detección (UTC)")
    temperatura_celsius: float | None = Field(None, description="Temperatura estimada en grados Celsius")
    temperatura_texto: str = Field(
        ..., 
        description="Descripción de la temperatura",
        example="Muy caliente"
    )
    confianza: str = Field(..., description="Nivel de confianza de la detección (Alta/Nominal/Baja)")
    confianza_texto: str = Field(
        ..., 
        description="Explicación de la confianza",
        example="El satélite está seguro de este foco"
    )
    frp: float | None = Field(None, description="Potencia radiativa del fuego (MW)")
    intensidad_texto: str = Field(
        ..., 
        description="Descripción de la intensidad",
        example="Fuego fuerte, visible desde lejos"
    )
    area_protegida: str | None = Field(None, description="Nombre del área protegida si corresponde")

class ResumenResponse(BaseModel):
    """Resumen general de la situación"""
    cantidad_focos: int = Field(..., description="Cantidad total de focos detectados")
    periodo: str = Field(..., description="Período consultado (ej: 24h, 48h, semana)")
    fuente_datos: str = Field(..., description="Fuente satelital (ej: VIIRS, MODIS)")
    mensaje: str = Field(..., description="Mensaje de situación")

class APIResponse(BaseModel):
    """Respuesta completa de la API"""
    resumen: ResumenResponse
    focos: List[FocoCalorResponse]

    class Config:
        json_schema_extra = {
            "example": {
                "resumen": {
                    "cantidad_focos": 2,
                    "periodo": "24h",
                    "fuente_datos": "Satélite VIIRS",
                    "mensaje": "Se detectaron 2 focos de calor en las últimas 24 horas. Si está cerca de estos puntos, mantenga distancia y avise a un guardaparque."
                },
                "focos": [
                    {
                        "latitud": -28.5532,
                        "longitud": -57.3423,
                        "fecha_hora": "2024-06-05T15:30:00Z",
                        "temperatura_celsius": 78.5,
                        "temperatura_texto": "Muy caliente",
                        "confianza": "Alta",
                        "confianza_texto": "El satélite está seguro de este foco",
                        "frp": 4.7,
                        "intensidad_texto": "Fuego fuerte, visible desde lejos",
                        "area_protegida": "Parque Nacional Iberá"
                    },
                    {
                        "latitud": -28.6000,
                        "longitud": -57.4000,
                        "fecha_hora": "2024-06-05T16:10:00Z",
                        "temperatura_celsius": 65.2,
                        "temperatura_texto": "Caliente",
                        "confianza": "Nominal",
                        "confianza_texto": "El satélite tiene dudas, pero es posible que haya fuego",
                        "frp": 2.1,
                        "intensidad_texto": "Fuego de baja intensidad",
                        "area_protegida": None
                    }
                ]
            }
        }
