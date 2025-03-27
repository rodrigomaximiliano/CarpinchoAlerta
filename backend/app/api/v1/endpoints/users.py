from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_users():
    return {"message": "Lista de usuarios"}

@router.post("/")
async def create_user():
    return {"message": "Usuario creado"}