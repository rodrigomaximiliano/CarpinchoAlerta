from sqlalchemy.orm import Session
from app.db.models.user import User  # Asegúrate de que la importación del modelo sea correcta

def get_user_by_email(db: Session, email: str) -> User | None:
    """Obtiene un usuario por su email."""
    return db.query(User).filter(User.email == email).first()