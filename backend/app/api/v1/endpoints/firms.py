from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.schemas.external.firms import FIRMSFireData
from app.services.firms import FIRMSService
from app.api.deps import get_current_active_user

router = APIRouter()
firms_service = FIRMSService()

@router.get("/", response_model=List[FIRMSFireData])
async def get_active_fires(
    region: str = "ARG",
    days: int = 1,
    current_user=Depends(get_current_active_user)
):
    """
    Obtiene datos de incendios activos de NASA FIRMS
    """
    try:
        return firms_service.get_active_fires(region=region, days=days)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error inesperado: {str(e)}"
        )