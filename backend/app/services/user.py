from sqlalchemy.orm import Session
from typing import Optional
from app.db.models.user import User as UserModel  # Renombrar para evitar conflicto
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password

class UserService:
    def get_user_by_email(self, db: Session, *, email: str) -> Optional[UserModel]:
        """Obtiene un usuario por su email."""
        return db.query(UserModel).filter(UserModel.email == email).first()

    def create_user(self, db: Session, *, user_in: UserCreate) -> UserModel:
        """
        Crea un nuevo usuario.
        """
        hashed_password = get_password_hash(user_in.password)
        db_user = UserModel(
            email=user_in.email,
            hashed_password=hashed_password,  # Guardar la contraseña hasheada
            full_name=user_in.full_name,
            role=user_in.role,
            is_active=True  # Activar por defecto
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    def authenticate_user(
        self, db: Session, *, email: str, password: str
    ) -> Optional[UserModel]:
        """
        Autentica a un usuario.
        Busca el usuario por email y verifica la contraseña.
        """
        user = self.get_user_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

# Crear una instancia del servicio para ser usada en los endpoints
user_service = UserService()