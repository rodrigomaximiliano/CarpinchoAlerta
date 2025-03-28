from fastapi import APIRouter, Depends, Query, HTTPException
from app.services.gee import GEEService
from app.schemas.external.gee import GEEHistoricalApiResponse
import datetime
from typing import List, Dict, Any, Optional

router = APIRouter()

# Caché simple para la instancia del servicio GEE (Singleton básico)
_gee_service_instance: Optional[GEEService] = None

def get_gee_service() -> GEEService:
    """Dependency function para obtener la instancia del GEEService."""
    global _gee_service_instance
    if _gee_service_instance is None:
        _gee_service_instance = GEEService()
        # La inicialización real de GEE ocurrirá dentro de los métodos del servicio
    return _gee_service_instance


@router.get("/ndvi-stats", 
            summary="Obtener estadísticas NDVI regional",
            response_description="Una lista de diccionarios con la fecha y el NDVI medio para Corrientes.")
async def get_regional_ndvi(
    service: GEEService = Depends(get_gee_service), # Inyectar dependencia
    start_date: Optional[str] = Query(None, description="Fecha de inicio (YYYY-MM-DD). Por defecto: hace un año."),
    end_date: Optional[str] = Query(None, description="Fecha de fin (YYYY-MM-DD). Por defecto: hoy."),
) -> List[Dict[str, Any]]: # Mantener el tipo de respuesta original aquí
    """Obtiene estadísticas de NDVI (media) para toda la provincia de Corrientes \
    calculadas a partir de imágenes MODIS en el rango de fechas especificado (por defecto, último año)."""
    # Calcular fechas por defecto si no se proporcionan
    if end_date is None:
        end_date_dt = datetime.date.today()
        end_date = end_date_dt.strftime('%Y-%m-%d')
    else:
        try:
            end_date_dt = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Formato de fecha final inválido. Usar YYYY-MM-DD.")
    
    if start_date is None:
        start_date_dt = end_date_dt - datetime.timedelta(days=365)
        start_date = start_date_dt.strftime('%Y-%m-%d')
    else:
        try:
            datetime.datetime.strptime(start_date, '%Y-%m-%d')
        except ValueError:
            raise HTTPException(status_code=400, detail="Formato de fecha inicial inválido. Usar YYYY-MM-DD.")
    
    # Llamar al servicio GEE
    # Ahora la inicialización ocurre dentro si es necesario
    ndvi_stats = service.get_regional_ndvi_stats(
        start_date=start_date, 
        end_date=end_date
    )
    return ndvi_stats

@router.get("/historical-fires", 
            summary="Obtener focos de calor históricos",
            response_description="Resumen y datos diarios de píxeles de fuego detectados por MODIS.",
            response_model=GEEHistoricalApiResponse)
async def get_historical_fires(
    service: GEEService = Depends(get_gee_service), # Inyectar dependencia
    start_date: Optional[str] = Query(None, description="Fecha de inicio (YYYY-MM-DD). Por defecto: hace un año."),
    end_date: Optional[str] = Query(None, description="Fecha de fin (YYYY-MM-DD). Por defecto: hoy."),
):
    """Obtiene una lista de detecciones de focos de calor históricos (MODIS) \
    para la provincia de Corrientes en el rango de fechas especificado (por defecto, último año)."""
    # Calcular fechas por defecto si no se proporcionan
    if end_date is None:
        end_date_dt = datetime.date.today()
        end_date = end_date_dt.strftime('%Y-%m-%d')
    else:
        try:
            end_date_dt = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            raise HTTPException(status_code=400, detail="Formato de fecha final inválido. Usar YYYY-MM-DD.")
            
    if start_date is None:
        start_date_dt = end_date_dt - datetime.timedelta(days=365)
        start_date = start_date_dt.strftime('%Y-%m-%d')
    else:
        try:
            datetime.datetime.strptime(start_date, '%Y-%m-%d')
        except ValueError:
            raise HTTPException(status_code=400, detail="Formato de fecha inicial inválido. Usar YYYY-MM-DD.")

    # Llamar al servicio GEE
    # Ahora la inicialización ocurre dentro si es necesario
    fire_data = service.get_historical_fire_data(
        start_date=start_date,
        end_date=end_date
    )
    return fire_data