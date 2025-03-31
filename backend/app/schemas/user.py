from enum import Enum  # <-- Añade esta línea
from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UserRole(str, Enum):
    citizen = "citizen"
    admin = "admin"
    firefighter = "firefighter"

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = Field(None, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=64)
    role: UserRole = UserRole.citizen

class UserInDBBase(UserBase):
    id: int
    is_active: bool
    role: UserRole

    class Config:
        orm_mode = True

class User(UserInDBBase):
    pass

class UserWithToken(User):
    access_token: str
    token_type: str = "bearer"

# Nuevo schema para la respuesta del token en /login
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"