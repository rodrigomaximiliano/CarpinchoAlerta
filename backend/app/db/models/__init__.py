# Exporta todos los modelos y Base para que SQLAlchemy los reconozca
from app.db.base_class import Base
from .user import User
from .report import Report
from .alert import Alert

__all__ = ["Base", "User", "Report", "Alert"]  # Opcional pero recomendado