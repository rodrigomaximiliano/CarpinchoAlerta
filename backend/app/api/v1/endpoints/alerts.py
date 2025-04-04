from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_alerts():
    # TODO: Implementar la lógica real para obtener alertas de la base de datos o servicio
    return [] # Devuelve un array vacío por ahora