from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_alerts():
    return {"message": "Lista de alertas"}