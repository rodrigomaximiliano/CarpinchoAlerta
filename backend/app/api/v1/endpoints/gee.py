from fastapi import APIRouter, Depends, Query, HTTPException, Body
from app.services.gee import GEEService
from app.schemas.external.gee import GEEHistoricalApiResponse, NBRAnalysisResponse, NBRResult
import datetime
from typing import List, Dict, Any, Optional
import ee
import json

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

@router.post("/nbr-analysis", 
            response_model=NBRAnalysisResponse,
            summary="Calcular el NBR (Normalized Burn Ratio)",
            description="""
            Calcula el NBR (Normalized Burn Ratio) para evaluar la severidad de un incendio.
            Compara imágenes satelitales pre y post-incendio para determinar el daño causado.
            """
           )
async def calculate_nbr_analysis(
    pre_fire_date: str = Query(..., description="Fecha pre-incendio en formato 'YYYY-MM-DD'"),
    post_fire_date: str = Query(..., description="Fecha post-incendio en formato 'YYYY-MM-DD'"),
    geometry: Optional[Dict[str, Any]] = Body(
        None,
        example={
            "type": "Polygon",
            "coordinates": [
                [
                    [-60.0, -30.0],
                    [-55.0, -30.0],
                    [-55.0, -27.0],
                    [-60.0, -27.0],
                    [-60.0, -30.0]
                ]
            ]
        },
        description="Geometría GeoJSON del área de interés. Si no se proporciona, se usa la provincia de Corrientes."
    ),
    service: GEEService = Depends(get_gee_service)
):
    """
    Calcula el NBR (Normalized Burn Ratio) para evaluar la severidad de un incendio.
    
    El NBR se calcula como: (NIR - SWIR2) / (NIR + SWIR2)
    
    El dNBR (diferencial NBR) se calcula como: NBR_pre_incendio - NBR_post_incendio
    
    Valores de severidad basados en dNBR:
    - dNBR < 0.1: Aumento en la vegetación
    - 0.1 <= dNBR < 0.27: Severidad baja
    - 0.27 <= dNBR < 0.44: Severidad moderada-baja
    - 0.44 <= dNBR < 0.66: Severidad moderada-alta
    - dNBR >= 0.66: Severidad alta
    """
    try:
        # Validar fechas
        try:
            pre_date = datetime.datetime.strptime(pre_fire_date, '%Y-%m-%d').date()
            post_date = datetime.datetime.strptime(post_fire_date, '%Y-%m-%d').date()
            
            if pre_date >= post_date:
                raise HTTPException(
                    status_code=400,
                    detail="La fecha pre-incendio debe ser anterior a la fecha post-incendio"
                )
                
            # Asegurarse de que las fechas no estén en el futuro
            today = datetime.date.today()
            if pre_date > today or post_date > today:
                raise HTTPException(
                    status_code=400,
                    detail="Las fechas no pueden estar en el futuro"
                )
                
        except ValueError:
            raise HTTPException(
                status_code=400,
                detail="Formato de fecha inválido. Usar YYYY-MM-DD"
            )
        
        # Convertir la geometría de GeoJSON a objeto ee.Geometry si se proporciona
        ee_geometry = None
        if geometry:
            try:
                # Validar que la geometría sea un GeoJSON válido
                if 'type' not in geometry or 'coordinates' not in geometry:
                    raise ValueError("Formato GeoJSON inválido. Se requiere 'type' y 'coordinates'")
                
                # Crear geometría de Earth Engine a partir de GeoJSON
                if geometry['type'].lower() == 'polygon':
                    ee_geometry = ee.Geometry.Polygon(geometry['coordinates'])
                elif geometry['type'].lower() == 'point':
                    # Para un punto, creamos un buffer de 1km
                    point = geometry['coordinates']
                    ee_geometry = ee.Geometry.Point(point[0], point[1]).buffer(1000)  # 1km de radio
                else:
                    # Para otros tipos de geometría, intentamos crear un polígono delimitador
                    ee_geometry = ee.Geometry(geometry).bounds()
            except Exception as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"Error al procesar la geometría: {str(e)}"
                )
        
        # Llamar al servicio para calcular el NBR
        results = service.calculate_nbr(
            pre_fire_date=pre_fire_date,
            post_fire_date=post_fire_date,
            geometry=ee_geometry
        )
        
        # Formatear la respuesta según el esquema NBRAnalysisResponse
        response = {
            'pre_fire_date': pre_fire_date,
            'post_fire_date': post_fire_date,
            'results': [
                {
                    'date': pre_fire_date,
                    'nbr_value': results['pre_fire_nbr'],
                    'dNBR': None,
                    'severity': None,
                    'geometry': results.get('geometry')
                },
                {
                    'date': post_fire_date,
                    'nbr_value': results['post_fire_nbr'],
                    'dNBR': results['dnbr'],
                    'severity': results['severity'],
                    'geometry': results.get('geometry')
                }
            ],
            'metadata': {
                'description': 'Análisis NBR para evaluación de severidad de incendios',
                'satellite': 'Landsat 8',
                'processing_date': datetime.datetime.now().isoformat(),
                'severity_scale': {
                    '0': 'Aumento en la vegetación',
                    '1': 'Severidad baja',
                    '2': 'Severidad moderada-baja',
                    '3': 'Severidad moderada-alta',
                    '4': 'Severidad alta'
                }
            }
        }
        
        return response
        
    except HTTPException:
        # Re-lanzar excepciones HTTP existentes
        raise
    except Exception as e:
        logger.exception(f"Error inesperado en calculate_nbr_analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Error interno al calcular el NBR: {str(e)}"
        )