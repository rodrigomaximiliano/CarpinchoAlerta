from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.schemas.external.firms import FIRMSApiResponse
from app.services.firms import FIRMSService
import logging

router = APIRouter()
firms_service = FIRMSService()
logger = logging.getLogger(__name__)

@router.get(
    "/corrientes",
    response_model=FIRMSApiResponse,
    summary="Incendios en Corrientes",
    description="Obtiene datos de incendios activos en la provincia de Corrientes, Argentina"
)
async def get_corrientes_fires(days: int = Query(1, ge=1, le=7, description="Número de días a consultar (1-7)")):
    """
    Parámetros:
    - days: Cantidad de días hacia atrás para consultar (1-7 días). Por defecto: 1.
    """
    try:
        logger.info(f"Solicitud recibida para {days} días")
        data = firms_service.get_active_fires(days=days)
        
        if not data:
            return []
            
        return data
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en endpoint: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Error interno al procesar la solicitud"
        )