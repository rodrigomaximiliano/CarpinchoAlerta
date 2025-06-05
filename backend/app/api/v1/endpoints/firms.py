from fastapi import APIRouter, HTTPException, Query
from app.schemas.external.firms import FIRMSApiResponse
from app.schemas.responses import APIResponse  # <-- Importa el modelo correcto
from app.schemas.firms import TimePeriod  # <-- Importar desde el archivo correcto
from app.services.firms import FIRMSService, firms_cache  # Add firms_cache import
import logging
from datetime import datetime
from typing import Optional

router = APIRouter(
    prefix="/firms",
    tags=["Focos de Calor"],
)

firms_service = FIRMSService()
logger = logging.getLogger(__name__)

@router.get(
    "/",
    response_model=APIResponse,  # <-- Usa el modelo correcto aquí
    summary="Consulta de Focos de Calor"
)
async def get_fires(
    period: TimePeriod = Query(
        default=TimePeriod.LAST_24H,
        description="Período de consulta"
    )
):
    """Obtiene datos de focos de calor según el período especificado."""
    try:
        return firms_service.get_active_fires(period)
    except Exception as e:
        logger.error(f"Error en get_fires: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail={
                "error": str(e),
                "sugerencia": "Intente nuevamente en unos minutos"
            }
        )

@router.get("/status")
async def get_firms_status():
    """Obtiene el estado de actualización de los datos"""
    try:
        return {
            "ultima_actualizacion": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "tiempo_cache": f"{firms_cache.ttl/60:.1f} minutos",
            "elementos_cacheados": len(firms_cache),
            "proximo_refresco": datetime.fromtimestamp(
                datetime.now().timestamp() + firms_cache.ttl
            ).strftime("%Y-%m-%d %H:%M:%S")
        }
    except Exception as e:
        logger.error(f"Error al obtener estado del cache: {str(e)}")
        raise HTTPException(
            status_code=500, 
            detail="Error al obtener estado de actualización"
        )