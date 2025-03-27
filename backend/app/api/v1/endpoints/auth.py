from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

router = APIRouter()

# Ejemplo de modelo y lógica de autenticación (simplificado)
class User(BaseModel):
    username: str
    password: str

fake_users_db = {
    "admin": {
        "username": "admin",
        "password": "secret"
    }
}

@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user_dict = fake_users_db.get(form_data.username)
    if not user_dict or user_dict["password"] != form_data.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas"
        )
    return {"access_token": form_data.username, "token_type": "bearer"}

@router.get("/me")
async def read_users_me():
    return {"message": "Datos del usuario actual"}