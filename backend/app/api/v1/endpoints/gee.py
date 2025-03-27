from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_gee_data():
    return {"message": "Datos de Google Earth Engine"}