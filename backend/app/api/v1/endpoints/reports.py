from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_reports():
    return {"message": "Lista de reportes"}